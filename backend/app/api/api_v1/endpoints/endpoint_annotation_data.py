import hashlib

from fastapi import APIRouter, Depends, File, HTTPException, Response, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.api.api_v1 import helpers
from app.core import logic
from app.schemas.schema_task import TaskStatus

router = APIRouter()


@router.post("/{annotation_id}", response_model=schemas.AnnotationDataApiOut)
def create_annotation_data(
    *,
    db: Session = Depends(deps.get_db),
    annotation_id: int,
    annotation_data: bytes = File(...),
    current_user: models.User = Depends(deps.get_current_user_with_role([schemas.RoleType.annotator])),
) -> models.AnnotationData:
    """
    Create new instance of annotation data bound to annotation object.
      - **annotation_id** - id of annotation that will be assigned to new data object
      - **annotation_data** - binary blob with max size equal to 1MB.
    """
    # check if annotation_data is not too large
    if len(annotation_data) > 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Cannot save annotation larger than 1MB.",
        )

    existing_annotation = crud.annotation.get(db, id=annotation_id)
    helpers.validate_access_to_annotation(existing_annotation, current_user)
    assert existing_annotation

    task = crud.task.get(db, id=existing_annotation.parent_task_id)
    assert task

    if task.status != TaskStatus.in_progress:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot update annotation when parent task is not in progress.",
        )

    annotation_has_data = len(existing_annotation.data_list) > 0
    new_sequence = 0 if not annotation_has_data else existing_annotation.data_list[-1].sequence + 1

    if (
        annotation_has_data
        and existing_annotation.data_list[-1].md5_hash == hashlib.md5(annotation_data).hexdigest()
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Annotation data is already up to date.",
        )

    create_obj = schemas.AnnotationDataCreateCrud(
        annotation_id=annotation_id,
        data=annotation_data,
        sequence=new_sequence,
        md5_hash=hashlib.md5(annotation_data).hexdigest(),
    )

    annotation_data_obj = crud.annotation_data.create(db, obj_in=create_obj)
    return annotation_data_obj


@router.get("/")
def read_annotation_data(
    *,
    db: Session = Depends(deps.get_db),
    annotation_id: int,
    sequence: int,
    task_id: int | None = None,
    current_user: models.User = Depends(
        deps.get_current_user_with_role(
            [schemas.RoleType.annotator, schemas.RoleType.data_admin, schemas.RoleType.task_admin]
        )
    ),
):
    """
    Read annotation data binary blob by:
      - **annotation_id** - annotation id
      - **sequence** - sequence number of annotation data
    """

    if task_id is not None:
        task = crud.task.get(db, id=task_id)
        helpers.validate_access_to_task(
            task,
            current_user,
            roles_bypassing_access=[schemas.RoleType.data_admin, schemas.RoleType.task_admin],
        )
        assert task

        all_allowed_annotations = logic.annotation.get_all_annotations_from_task(task)
        if annotation_id not in {annotation.id for annotation in all_allowed_annotations}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User does not have access to requested image instance.",
            )
    else:
        helpers.validate_access_by_role(current_user, [schemas.RoleType.task_admin])

    annotation = crud.annotation.get(db, id=annotation_id)

    if annotation is None or len(annotation.data_list) < sequence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"There is no annotation data for annotation_id={annotation_id} and sequence={sequence}.",
        )

    return Response(
        content=annotation.data_list[sequence].data,
        media_type="application/octet-stream",
    )


@router.get(
    "/get_latest_blob_hash/{annotation_id}",
    response_model=schemas.AnnotationDataGetLatestHashApiOut,
)
def get_latest_blob_hash_for_annotation(
    *,
    db: Session = Depends(deps.get_db),
    annotation_id: int,
    current_user: models.User = Depends(
        deps.get_current_user_with_role([schemas.RoleType.annotator, schemas.RoleType.data_admin])
    ),
) -> models.AnnotationData:
    """
    Returns md5 hash of the latest binary blob uploaded for annotation.
    """
    annotation = crud.annotation.get(db, id=annotation_id)
    helpers.validate_access_to_annotation(
        annotation, current_user, roles_bypassing_access=[schemas.RoleType.data_admin]
    )
    assert annotation

    task = crud.task.get(db, id=annotation.parent_task_id)
    helpers.validate_access_to_task(
        task, current_user, roles_bypassing_access=[schemas.RoleType.data_admin]
    )

    if len(annotation.data_list) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="There is no data for requested annotation.",
        )

    return annotation.data_list[-1]
