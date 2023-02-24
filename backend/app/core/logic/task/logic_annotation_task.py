from typing import Any
from sqlalchemy.orm import Session

from app import schemas, models, crud, query, core


def create_annotation_task(
    db: Session,
    task_in: schemas.TaskCreateApiIn,
    current_user: models.User,
) -> models.Task:

    assert task_in.image_instance_ids
    task_in.label_assignment_ids = task_in.label_assignment_ids or []

    task_label_assignments: list[
        models.LabelAssignment
    ] = crud.label_assignment.get_multi_by_ids(db, ids=task_in.label_assignment_ids)

    if len(task_label_assignments) > 0:
        for label_assignment in task_label_assignments:
            if label_assignment.image_instance_id not in task_in.image_instance_ids:
                raise core.LogicError(core.LogicErrorCode.task_input_misaligned)

    # check if there are no active tasks with assigned dicom and label
    conflicting_task_count = query.task.query_tasks_with_label_assignments(
        db, task_in.label_assignment_ids, schemas.TaskStatus.active_statuses()
    ).count()
    if conflicting_task_count > 0:
        raise core.LogicError(core.LogicErrorCode.dicom_and_label_combo_already_in_task)

    for label_assignment in task_label_assignments:
        if label_assignment.is_annotated is True:
            raise core.LogicError(
                core.LogicErrorCode.label_assignment_already_annotated,
                id=label_assignment.id,
            )

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
    # create annotation object for each label and dicom combination

    assert task.assigned_user_id is not None

    annotation_objs_in: list[schemas.AnnotationCreateCrud] = []
    for label_assignment in task.label_assignments:
        # get last existing annotation for label assignment
        last_annotation = (
            query.annotation.query_all_for_label_assignment(db, label_assignment.id)
            .order_by(models.Annotation.version.desc())
            .first()
        )

        next_version = last_annotation.version + 1 if last_annotation else 0

        obj_in = schemas.AnnotationCreateCrud(
            label_assignment_id=label_assignment.id,
            parent_task_id=task.id,
            author_id=task.assigned_user_id,
            version=next_version,
            status=schemas.AnnotationStatus.open,
            spent_time=0,
        )
        annotation_objs_in.append(obj_in)

    crud.annotation.create_bulk(db, objs_in=annotation_objs_in, commit=False)

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
    # TODO: remove annotations without data blobs
    # TODO: change status of annotation with data blobs to done
    return task


def _status_in_progress_to_done(
    db: Session, task: models.Task, **kwargs: Any
) -> models.Task:
    remove_draft_data = kwargs.get("remove_draft_data", False)
    task_annotations: list[models.Annotation] = query.annotation.query_by_task(
        db, task.id
    ).all()

    # check if each annotation has at least one data blob
    for annotation in task_annotations:
        if len(annotation.data_list) == 0:
            raise core.LogicError(
                core.LogicErrorCode.annotation_missing_data_blob, id=annotation.id
            )

        if remove_draft_data:
            annotation.data_list = [annotation.data_list[-1]]
        annotation.status = schemas.AnnotationStatus.done

    total_time = 0
    for annotation in task_annotations:
        total_time += annotation.spent_time

    task_in = schemas.TaskUpdateCrud(total_time=total_time)

    task = crud.task.update(db, db_obj=task, obj_in=task_in, commit=False)

    return task


annotation_task_status_flows: dict[
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
def change_annotation_task_status(
    db: Session,
    task: models.Task,
    new_status: schemas.TaskStatus,
    commit_changes: bool = True,
    **kwargs: Any
) -> models.Task:
    task_status = schemas.TaskStatus(task.status)
    if new_status not in annotation_task_status_flows[task_status]:
        raise core.LogicError(core.LogicErrorCode.invalid_status_change)

    task = annotation_task_status_flows[task_status][new_status](db, task)
    task.status = new_status

    if commit_changes:
        db.commit()

    return task
