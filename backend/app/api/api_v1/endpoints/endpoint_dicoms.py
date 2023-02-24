from dicomweb_client import DICOMwebClient
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas, query
from app.api import deps
from app.api.api_v1 import helpers
from app.core import logic
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
        deps.get_current_user_with_role([schemas.RoleType.annotator, schemas.RoleType.data_admin])
    ),
) -> list[models.Dicom]:
    """
    Read metadata of all dicoms related to image instance.
    """

    image_instance = crud.image_instance.get(db, id=image_instance_id)

    if task_id is not None:
        task = crud.task.get(db, id=task_id)
        helpers.validate_access_to_task(task, current_user)
        assert task

        image_instances = logic.image_instance.get_all_image_instances_for_task(task)
        if image_instance_id not in {ii.id for ii in image_instances}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User does not have access to requested image instance.",
            )

    else:
        helpers.validate_access_by_role(current_user)

    if not image_instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Image instance with id={image_instance} does not exist.",
        )

    dicoms: list[models.Dicom] = query.dicom.query_by_series_id(
        db, series_id=image_instance.id_ref
    ).all()

    return dicoms


@router.post("/sync_dicomweb", response_model=list[schemas.DicomApiOut])
def sync_dicomweb(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user_with_role([schemas.RoleType.data_admin])),
) -> list[models.Dicom]:
    """
    Sync internal backend database with attached pacs using dicomweb.
    """
    client = DICOMwebClient(url=f"http://{settings.DICOMWEB_ORIGIN}")

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

    return synced_dicoms
