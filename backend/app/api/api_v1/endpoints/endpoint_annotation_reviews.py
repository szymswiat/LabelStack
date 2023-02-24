from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas, query
from app.api import deps
from app.api.api_v1 import helpers
from app.core import logic

router = APIRouter()


@router.get("/", response_model=list[schemas.AnnotationReviewApiOut])
def read_annotation_reviews(
    *,
    db: Session = Depends(deps.get_db),
    by_task_id: int,
    current_user: models.User = Depends(
        deps.get_current_user_with_role([schemas.RoleType.annotator, schemas.RoleType.task_admin])
    ),
) -> list[models.AnnotationReview]:
    """
    Read list of annotation reviews filtered by following options:
      - **by_task_id** - return annotation reviews bound to task
    """
    task = crud.task.get(db, id=by_task_id)
    helpers.validate_access_to_task(task, current_user)

    annotations_out = query.annotation_review.query_by_task(db, by_task_id).all()

    return annotations_out


@router.put("/{annotation_review_id}", response_model=schemas.AnnotationReviewApiOut)
def update_annotation_review(
    *,
    db: Session = Depends(deps.get_db),
    annotation_review_id: int,
    annotation_review_in: schemas.AnnotationReviewUpdateApiIn,
    current_user: models.User = Depends(
        deps.get_current_user_with_role([schemas.RoleType.annotator, schemas.RoleType.task_admin])
    ),
) -> models.AnnotationReview:
    """
    Update annotation review.
    """
    review = crud.annotation_review.get(db, id=annotation_review_id)

    if review is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"There is no review with specified id={annotation_review_id}.",
        )
    task = crud.task.get(db, id=review.parent_task_id)
    helpers.validate_access_to_task(task, current_user)

    review = logic.annotation.change_annotation_review_result(
        db, review, new_result=annotation_review_in.result, commit_changes=False
    )

    annotation_review_in = schemas.AnnotationReviewUpdateCrud(**annotation_review_in.dict())
    updated_annotation_review = crud.annotation_review.update(
        db, db_obj=review, obj_in=annotation_review_in
    )

    return updated_annotation_review
