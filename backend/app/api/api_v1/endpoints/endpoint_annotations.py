from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas, query
from app.api import deps
from app.api.api_v1 import helpers
from app.core import logic

router = APIRouter()


@router.put("/{id}", response_model=schemas.AnnotationApiOut)
def update_annotation(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    obj_in: schemas.AnnotationUpdateApiIn,
    current_user: models.User = Depends(
        deps.get_current_user_with_role([schemas.RoleType.annotator])
    ),
):
    """
    Update existing annotation.
    """
    annotation = crud.annotation.get(db, id=id)
    helpers.validate_access_to_annotation(annotation, current_user)
    assert annotation

    update_obj = schemas.AnnotationUpdateCrud.parse_obj(obj_in.dict())

    updated_obj = crud.annotation.update(db, db_obj=annotation, obj_in=update_obj)

    return updated_obj


@router.get("/", response_model=list[schemas.AnnotationApiOut])
def read_annotations(
    *,
    db: Session = Depends(deps.get_db),
    by_id: int | None = None,
    by_task_id: int | None = None,
    waiting_for_review: bool | None = None,
    without_active_task: bool | None = None,
    required_accepted_reviews: int = 1,
    current_user: models.User = Depends(
        deps.get_current_user_with_role(
            [schemas.RoleType.annotator, schemas.RoleType.task_admin]
        )
    ),
) -> list[schemas.Annotation] | list[models.Annotation]:
    """
    Read list of annotations filtered by following options:
      - **by_id** - return annotation with id
      - **by_task_id** - return annotations bound to task
      - **waiting_for_review** - return annotations waiting for review
        - **without_active_task** - exclude annotations with active review task
        - **required_accepted_reviews** - count of required reviews to assume that annotation is finished
    """
    annotations_out = []

    helpers.allow_use_one_of(
        {
            "by_id": by_id,
            "by_task_id": by_task_id,
            "waiting_for_review": waiting_for_review,
        }
    )

    if by_id is not None:
        annotation = crud.annotation.get(db, id=by_id)
        if annotation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"There is no annotation with given id={by_id}.",
            )
        task = crud.task.get(db, id=annotation.parent_task_id)
        helpers.validate_access_to_task(task, current_user)
        return [annotation]

    if by_task_id is not None:
        task = crud.task.get(db, id=by_task_id)
        helpers.validate_access_to_task(task, current_user)

        annotations_out = query.annotation.query_by_task(db, by_task_id).all()

    if waiting_for_review is not None:
        query_out = query.annotation.query_for_annotations_with_status(
            db, status=schemas.AnnotationStatus.done
        )
        if without_active_task:
            query_out = query.annotation.query_without_active_task(
                db, query_in=query_out
            )

        annotations_out = [schemas.Annotation.from_orm(a) for a in query_out.all()]
        annotations_out = logic.annotation.filter_annotations_waiting_for_review(
            annotations_out, required_accepted_reviews
        )

    return annotations_out
