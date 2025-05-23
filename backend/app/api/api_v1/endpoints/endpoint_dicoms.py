from datetime import timedelta
import threading

from dicomweb_client import DICOMwebClient
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app import crud, models, schemas, query
from app.api import deps
from app.api.api_v1 import helpers
from app.core import logic, security
from app.core.config import settings
from app import utils

router = APIRouter()


@router.get("/{id}", response_model=schemas.DicomApiOut)
def read_dicom(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_user_with_role()),
) -> models.Dicom:
    """
    Read metadata of single dicom by its **id**.
    """
    dicom = crud.dicom.get(db, id=id)

    if not dicom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dicom with id={id} does not exist.",
        )

    return dicom


@router.get("/for_image_instance/{image_instance_id}", response_model=list[schemas.DicomApiOut])
def read_dicoms_for_image_instance(
    *,
    db: Session = Depends(deps.get_db),
    image_instance_id: int,
    task_id: int | None = None,
    current_user: models.User = Depends(
        deps.get_current_user_with_role(
            [schemas.RoleType.annotator, schemas.RoleType.data_admin, schemas.RoleType.task_admin]
        )
    ),
) -> list[models.Dicom]:
    """
    Read metadata of all dicoms related to image instance.
    """

    image_instance = crud.image_instance.get(db, id=image_instance_id)

    if task_id is not None:
        task = crud.task.get(db, id=task_id)
        helpers.validate_access_to_task(
            task, current_user, roles_bypassing_access=[schemas.RoleType.task_admin]
        )
        assert task

        image_instances = logic.image_instance.get_all_image_instances_for_task(task)
        if image_instance_id not in {ii.id for ii in image_instances}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User does not have access to requested image instance.",
            )

    else:
        helpers.validate_access_by_role(current_user, [schemas.RoleType.task_admin])

    if not image_instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Image instance with id={image_instance} does not exist.",
        )

    dicoms: list[models.Dicom] = query.dicom.query_by_series_id(
        db, series_id=image_instance.id_ref
    ).all()

    return dicoms


sync_timer: threading.Timer | None = None


@router.post("/sync_dicomweb")
def sync_dicomweb(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user_with_role([schemas.RoleType.data_admin])),
    immediate: bool = Query(False),
):
    """
    Sync internal backend database with attached pacs using dicomweb.
    """

    def perform_sync():

        user = crud.user.authenticate(
            db, email=settings.INTERNAL_USER, password=settings.INTERNAL_USER_PASSWORD
        )
        assert user
        token = security.create_access_token(user.id, expires_delta=timedelta(minutes=1))

        client = DICOMwebClient(
            url=f"http://{settings.DICOMWEB_ORIGIN}",
            headers={"authorization": f"Bearer {token}"},
        )

        tags = utils.DicomTags.build(db)
        utils.DicomWebQidoInstance.bind_tags(tags)

        instances = [
            utils.DicomWebQidoInstance(instance)  # type: ignore
            for instance in client.search_for_instances(  # type: ignore
                fields=utils.ADDITIONAL_TAGS_TO_FETCH
            )
        ]
        series_list = [
            utils.DicomWebQidoInstance(series_item)  # type: ignore
            for series_item in client.search_for_series()  # type: ignore
        ]

        synced_dicoms = logic.dicom.sync_pacs_with_dicoms(db, instances, tags, commit=False)
        synced_image_instances = logic.image_instance.sync_pacs_with_image_instances(
            db, series_list, instances, tags, commit=False
        )

        db.commit()

        for image_instance in synced_image_instances:
            db.refresh(image_instance)

        for dicom in synced_dicoms:
            db.refresh(dicom)

        global sync_timer
        sync_timer = None

    if immediate:
        perform_sync()
        return

    global sync_timer
    if sync_timer:
        sync_timer.cancel()
    sync_timer = threading.Timer(settings.DICOMWEB_SYNC_DELAY, perform_sync)
    sync_timer.start()
