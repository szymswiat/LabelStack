from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app import schemas


def validate_label_task_input(db: Session, task_in: schemas.TaskCreateApiIn):
    if len(task_in.image_instance_ids) == 0:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"Dicom id list is required for this type of task.",
        )
    if len(task_in.label_assignment_ids) or len(task_in.annotation_ids):
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"Cannot insert label task with label_ids or annotation_ids.",
        )


def validate_annotation_task_input(db: Session, task_in: schemas.TaskCreateApiIn):
    if len(task_in.image_instance_ids) == 0:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"Image instance id list is required for this type of task.",
        )
    if len(task_in.annotation_ids):
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"Cannot insert annotation task with dicom_ids or annotation_ids.",
        )


def validate_annotation_review_task_input(
    db: Session, task_in: schemas.TaskCreateApiIn
):
    # TODO: verify if assigned user is not an author of at least one of dicom annotations
    if len(task_in.image_instance_ids) or len(task_in.label_assignment_ids):
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"Cannot insert segment review task with dicom_ids or label_ids.",
        )
    if len(task_in.annotation_ids) == 0:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"Cannot create segment review task without annotation_ids.",
        )
