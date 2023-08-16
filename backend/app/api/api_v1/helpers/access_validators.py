from fastapi import HTTPException, status

from app import models, schemas
from app.core import logic


def validate_access_to_task(
    task: models.Task | None,
    user: models.User,
    roles_bypassing_access: list[schemas.RoleType] | None = None,
    with_one_of_statuses: list[schemas.TaskStatus] | None = None,
    has_type: schemas.TaskType | None = None,
):
    if roles_bypassing_access is None:
        roles_bypassing_access = []
    roles_bypassing_access.append(schemas.RoleType.superuser)

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task does not exist.",
        )
    if has_type is not None:
        if task.task_type != has_type:
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
                detail=f"Selected task is not a task of type {has_type}.",
            )
    if not logic.user.has_role_one_of(user, roles_bypassing_access):
        if task.assigned_user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is not permitted to access selected task.",
            )

    if with_one_of_statuses is not None and task.status not in with_one_of_statuses:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Task is not in one of required statuses {with_one_of_statuses}.",
        )


def validate_access_by_role(
    user: models.User,
    roles_bypassing_access: list[schemas.RoleType] | None = None,
):
    if roles_bypassing_access is None:
        roles_bypassing_access = []
    roles_bypassing_access.append(schemas.RoleType.superuser)

    if not logic.user.has_role_one_of(user, roles_bypassing_access):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not permitted access requested content.",
        )


def validate_access_to_annotation(
    annotation: models.Annotation | None,
    user: models.User,
    roles_bypassing_access: list[schemas.RoleType] | None = None,
):
    if roles_bypassing_access is None:
        roles_bypassing_access = []
    roles_bypassing_access.append(schemas.RoleType.superuser)

    if annotation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Annotation with specified id does not exist.",
        )
    if not logic.user.has_role_one_of(user, roles_bypassing_access):
        if annotation.author_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is not permitted to access selected annotation.",
            )


def check_if_task_is_editable(
    task: models.Task,
):
    if task.status != schemas.TaskStatus.in_progress:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Data related to task can be modified if task is in progress only. "
            "Change status of task to 'In Progress'",
        )
