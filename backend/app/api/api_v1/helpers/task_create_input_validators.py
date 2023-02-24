from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app import schemas


def validate_label_task_input(db: Session, task_in: schemas.TaskCreateApiIn):
    if task_in.image_instance_ids is None or len(task_in.image_instance_ids) == 0:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Dicom id list is required for this type of task.",
        )
    if (
        task_in.label_assignment_ids is None
        or len(task_in.label_assignment_ids)
        or task_in.annotation_ids is None
        or len(task_in.annotation_ids)
    ):
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Cannot insert label task with label_ids or annotation_ids.",
        )


def validate_annotation_task_input(db: Session, task_in: schemas.TaskCreateApiIn):
    if task_in.image_instance_ids is None or len(task_in.image_instance_ids) == 0:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Image instance id list is required for this type of task.",
        )
    if task_in.annotation_ids is None or len(task_in.annotation_ids):
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Cannot insert annotation task with dicom_ids or annotation_ids.",
        )


def validate_annotation_review_task_input(db: Session, task_in: schemas.TaskCreateApiIn):
    # TODO: verify if assigned user is not an author of at least one of dicom annotations
    if (
        task_in.image_instance_ids is not None
        and len(task_in.image_instance_ids)
        or task_in.label_assignment_ids is not None
        and len(task_in.label_assignment_ids)
    ):
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Cannot insert segment review task with dicom_ids or label_ids.",
        )
    if task_in.annotation_ids is None or len(task_in.annotation_ids) == 0:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Cannot create segment review task without annotation_ids.",
        )
