from typing import Any
from sqlalchemy.orm import Session

from app import schemas, models, crud, query, core
from app.core import logic


def create_annotation_review_task(
    db: Session,
    task_in: schemas.TaskCreateApiIn,
    current_user: models.User,
) -> models.Task:
    # check if there is no active review for annotations
    assert task_in.annotation_ids
    conflicting_task_count = query.task.query_tasks_with_annotations(
        db, task_in.annotation_ids, schemas.TaskStatus.active_statuses()
    ).count()
    if conflicting_task_count > 0:
        raise core.LogicError(core.LogicErrorCode.annotation_already_in_review_task)

    # check if each annotation is waiting for review
    task_annotations = crud.annotation.get_multi_by_ids(db, task_in.annotation_ids)

    for task_annotation in task_annotations:
        if not logic.annotation.is_annotation_waiting_for_review(
            schemas.Annotation.from_orm(task_annotation),
            required_accepted_reviews=1,  # TODO: hardcoded
        ):
            raise core.LogicError(core.LogicErrorCode.annotation_not_waiting_for_review)

    if task_in.assigned_user_id is None:
        init_status = schemas.TaskStatus.unassigned
    else:
        init_status = schemas.TaskStatus.open

    task_obj_in = schemas.TaskCreateCrud(
        **task_in.dict(),
        status=init_status,
        total_time=0,
        submitter_user_id=current_user.id
    )

    created_task = crud.task.create(db, obj_in=task_obj_in)

    return created_task


def _status_unassigned_to_open(
    db: Session, task: models.Task, **kwargs: Any
) -> models.Task:
    if task.assigned_user_id is None:
        raise core.LogicError(core.LogicErrorCode.task_missing_assigned_user)
    return task


def _status_unassigned_to_cancelled(
    db: Session, task: models.Task, **kwargs: Any
) -> models.Task:
    # just change status
    return task


def _status_open_to_in_progress(
    db: Session, task: models.Task, **kwargs: Any
) -> models.Task:
    new_reviews: list[schemas.AnnotationReviewCreateCrud] = []

    # create AnnotationReview objects for all annotation specified in task
    annotations: list[models.Annotation] = task.annotations
    for annotation in annotations:
        if not logic.annotation.is_annotation_waiting_for_review(
            schemas.Annotation.from_orm(annotation),
            required_accepted_reviews=1,  # TODO: fixed
        ):
            raise core.LogicError(core.LogicErrorCode.annotation_not_waiting_for_review)

        new_sequence = (
            annotation.reviews[-1].sequence + 1 if len(annotation.reviews) > 0 else 0
        )

        assert task.assigned_user_id is not None

        review = schemas.AnnotationReviewCreateCrud(
            annotation_id=annotation.id,
            author_id=task.assigned_user_id,
            parent_task_id=task.id,
            sequence=new_sequence,
            status=schemas.AnnotationReviewStatus.open,
        )
        new_reviews.append(review)

    crud.annotation_review.create_bulk(db, objs_in=new_reviews, commit=False)

    return task


def _status_open_to_cancelled(
    db: Session, task: models.Task, **kwargs: Any
) -> models.Task:
    # just change status
    return task


def _status_in_progress_to_cancelled(
    db: Session, task: models.Task, **kwargs: Any
) -> models.Task:
    raise NotImplementedError()
    # TODO: add option for dropping all associated data
    # TODO: remove reviews with result == denied_corrected
    #       change status of remaining reviews to done
    return task


def _status_in_progress_to_done(
    db: Session, task: models.Task, **kwargs: Any
) -> models.Task:
    remove_draft_data = kwargs.get("remove_draft_data", False)

    created_annotations: list[models.Annotation] = []
    task_reviews: list[models.AnnotationReview] = query.annotation_review.query_by_task(
        db, task.id
    ).all()

    for review in task_reviews:
        if review.result is None:
            raise core.LogicError(core.LogicErrorCode.review_not_finished)
        if (
            review.result != schemas.AnnotationReviewResult.denied_corrected
            and review.resulting_annotation_id is not None
        ):
            raise core.LogicError(core.LogicErrorCode.review_valid_with_annotation)
        if (
            review.result == schemas.AnnotationReviewResult.denied_corrected
            and review.resulting_annotation_id is None
        ):
            raise core.LogicError(core.LogicErrorCode.review_invalid_no_annotation)

        if review.result == schemas.AnnotationReviewResult.denied_corrected:
            resulting_annotation = crud.annotation.get(
                db, id=review.resulting_annotation_id
            )
            assert resulting_annotation
            created_annotations.append(resulting_annotation)

            if len(resulting_annotation.data_list) == 0:
                raise core.LogicError(
                    core.LogicErrorCode.annotation_missing_data_blob,
                    id=resulting_annotation.id,
                )

            if remove_draft_data:
                resulting_annotation.data_list = [resulting_annotation.data_list[-1]]
            resulting_annotation.status = schemas.AnnotationStatus.done

        review.status = schemas.AnnotationReviewStatus.done

        if review.result == schemas.AnnotationReviewResult.accepted:
            bound_annotation = crud.annotation.get(db, id=review.annotation_id)
            assert bound_annotation
            if not logic.annotation.is_annotation_waiting_for_review(
                schemas.Annotation.from_orm(bound_annotation), 1
            ):
                # TODO: required_accepted_reviews hardcoded in above call
                bound_label_assignment = crud.label_assignment.get(
                    db, id=bound_annotation.label_assignment_id
                )
                assert bound_label_assignment
                bound_label_assignment.is_annotated = True

    # TODO: what about review time?
    total_time = 0
    for annotation in created_annotations:
        total_time += annotation.spent_time

    # update total time of task
    task.total_time = total_time

    return task


annotation_review_task_status_flows: dict[
    schemas.TaskStatus, dict[schemas.TaskStatus, Any]
] = {
    schemas.TaskStatus.unassigned: {
        schemas.TaskStatus.open: _status_unassigned_to_open,
        schemas.TaskStatus.cancelled: _status_unassigned_to_cancelled,
    },
    schemas.TaskStatus.open: {
        schemas.TaskStatus.in_progress: _status_open_to_in_progress,
        schemas.TaskStatus.cancelled: _status_open_to_cancelled,
    },
    schemas.TaskStatus.in_progress: {
        schemas.TaskStatus.cancelled: _status_in_progress_to_cancelled,
        schemas.TaskStatus.done: _status_in_progress_to_done,
    },
    # TODO: add flows for task reopen
}


# noinspection PyTypeChecker
def change_annotation_review_task_status(
    db: Session,
    task: models.Task,
    new_status: schemas.TaskStatus,
    commit_changes: bool = True,
    **kwargs: Any
) -> models.Task:
    task_status = schemas.TaskStatus(task.status)
    if new_status not in annotation_review_task_status_flows[task_status]:
        raise core.LogicError(core.LogicErrorCode.invalid_status_change)

    task = annotation_review_task_status_flows[task_status][new_status](db, task)
    task.status = new_status

    if commit_changes:
        db.commit()

    return task
