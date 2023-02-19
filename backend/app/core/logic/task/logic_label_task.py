from sqlalchemy.orm import Session

from app import schemas, models, crud, query, core


def create_label_task(
    db: Session,
    task_in: schemas.TaskCreateApiIn,
    current_user: models.User,
):
    active_redundant_task_count = query.task.query_active_tasks_with_image_instances(
        db, task_in.image_instance_ids
    ).count()
    if active_redundant_task_count > 0:
        raise core.LogicError(core.LogicErrorCode.dicom_already_in_label_task)

    if task_in.assigned_user_id is None:
        init_status = schemas.TaskStatus.unassigned
    else:
        init_status = schemas.TaskStatus.open

    obj_in = schemas.TaskCreateCrud(
        **task_in.dict(),
        status=init_status,
        total_time=0,
        submitter_user_id=current_user.id
    )

    task = crud.task.create(db, obj_in=obj_in)

    return task


def _status_unassigned_to_open(db: Session, task: models.Task, **kwargs) -> models.Task:
    if task.assigned_user_id is None:
        raise core.LogicError(core.LogicErrorCode.task_missing_assigned_user)
    return task


def _status_unassigned_to_cancelled(
    db: Session, task: models.Task, **kwargs
) -> models.Task:
    # just change status
    return task


def _status_open_to_in_progress(
    db: Session, task: models.Task, **kwargs
) -> models.Task:
    # just change status
    return task


def _status_open_to_cancelled(db: Session, task: models.Task, **kwargs) -> models.Task:
    # just change status
    return task


def _status_in_progress_to_cancelled(
    db: Session, task: models.Task, **kwargs
) -> models.Task:
    # TODO: add a way to check which images have assigned labels
    return task


def _status_in_progress_to_done(
    db: Session, task: models.Task, **kwargs
) -> models.Task:
    for image_instance in task.image_instances:
        image_instance.visited = True

    return task


label_task_status_flows = {
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
def change_label_task_status(
    db: Session,
    task: models.Task,
    new_status: schemas.TaskStatus,
    commit_changes=True,
    **kwargs
) -> models.Task:
    if new_status not in label_task_status_flows[task.status]:
        raise core.LogicError(core.LogicErrorCode.invalid_status_change)

    task = label_task_status_flows[task.status][new_status](db, task)
    task.status = new_status

    if commit_changes:
        db.commit()

    return task
