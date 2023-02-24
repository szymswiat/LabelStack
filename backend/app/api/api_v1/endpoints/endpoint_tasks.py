from typing import Any, Callable

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas, query, core
from app.api import deps
from app.api.api_v1 import helpers
from app.core import logic

router = APIRouter()


@router.post("/", response_model=schemas.TaskApiOut)
def create_task(
    *,
    db: Session = Depends(deps.get_db),
    task_in: schemas.TaskCreateApiIn,
    current_user: models.User = Depends(
        deps.get_current_user_with_role([schemas.RoleType.task_admin])
    ),
) -> models.Task:
    """
    Create a task. Task can be created with one of following types:
      - **TaskType.label (0)** - *label_ids* parameter have to contain list of assigned dicom ids
      - **TaskType.annotation (1)** - *dicom_ids* and *label_ids* parameters have to contain
        list of assigned dicom ids and label ids respectively
      - **TaskType.annotation_review (2)** - *annotation_ids* parameter have to contain
        list of assigned annotation ids
    """
    try:
        if task_in.task_type == schemas.TaskType.label_assignment:
            helpers.validate_label_task_input(db, task_in)
            task = logic.task.create_label_task(db, task_in, current_user)
        elif task_in.task_type == schemas.TaskType.annotation:
            helpers.validate_annotation_task_input(db, task_in)
            task = logic.task.create_annotation_task(db, task_in, current_user)
        elif task_in.task_type == schemas.TaskType.annotation_review:
            helpers.validate_annotation_review_task_input(db, task_in)
            task = logic.task.create_annotation_review_task(db, task_in, current_user)
        else:
            raise ValueError()
    except core.LogicError as error:
        if error.error_code == core.LogicErrorCode.dicom_already_in_label_task:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="At least one of dicoms is already assigned in other active task.",
            ) from error
        if (
            error.error_code
            == core.LogicErrorCode.dicom_and_label_combo_already_in_task
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Some of selected combination of dicom and label is "
                "already assigned in different active task.",
            ) from error
        if error.error_code == core.LogicErrorCode.annotation_not_finished:
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
                detail="At least one of selected annotations does not have 'done' status.",
            ) from error
        if error.error_code == core.LogicErrorCode.annotation_already_in_review_task:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="One annotation from selected annotations list is already assigned in other review.",
            ) from error
        if error.error_code == core.LogicErrorCode.label_assignment_already_annotated:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Label assignment with id={error.extra['id']} is already annotated.",
            ) from error
        raise error

    return task


@router.get("/", response_model=list[schemas.TaskApiOut])
def read_tasks(
    *,
    db: Session = Depends(deps.get_db),
    id: int | None = None,
    task_status: schemas.TaskStatus | None = None,
    task_type: schemas.TaskType | None = None,
    for_me: bool | None = None,
    for_user_id: int | None = None,
    current_user: models.User = Depends(
        deps.get_current_user_with_role([schemas.RoleType.annotator])
    ),
) -> list[models.Task | schemas.Task]:
    """
    Read list of tasks filtered by following options:
      - **id** - return task data by id
      - **task_status** - filters with specified task status, possible values:
        - *TaskStatus.unassigned (0)*, *TaskStatus.open (1)*, *TaskStatus.in_progress (2)*,
          *TaskStatus.done (3)*, *TaskStatus.cancelled (4)*,
      - **task_type** - filter tasks with specified task type, possible values:
        - *TaskType.label (0)*, *TaskType.annotation (1)*, *TaskType.annotation_review (2)*
      - **for_me** - filter tasks and return items assigned to api caller
      - **for_user_id** - filter tasks and return items assigned to user specified by id
        - for now only superuser can use this option
    """

    if id is not None:
        task = crud.task.get(db, id=id)
        helpers.validate_access_to_task(task, current_user)
        assert task

        return [helpers.convert_task_nested_to_ids(task)]
    query_out = query.task.query(db)

    if for_me:
        query_out = query.task.query_by_user(
            db, user_id=current_user.id, query_in=query_out
        )
    if for_user_id is not None:
        if not logic.user.has_role_one_of(current_user, [schemas.RoleType.superuser]):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is not permitted to use option 'for_user_id'.",
            )
        query_out = query.task.query_by_user(
            db, user_id=for_user_id, query_in=query_out
        )
    if task_status is not None:
        query_out = query.task.query_by_status(
            db, status_list=[task_status], query_in=query_out
        )
    if task_type is not None:
        query_out = query.task.query_by_type(
            db, task_type=task_type, query_in=query_out
        )

    return [helpers.convert_task_nested_to_ids(task) for task in query_out.all()]


@router.post("/change_status/{task_id}", response_model=schemas.TaskApiOut)
def change_task_status(
    *,
    db: Session = Depends(deps.get_db),
    new_status: schemas.TaskStatus,
    task_id: int,
    current_user: models.User = Depends(
        deps.get_current_user_with_role(
            [schemas.RoleType.annotator, schemas.RoleType.task_admin]
        )
    ),
) -> models.Task | schemas.Task:
    """
    Update status of task. Task status flows are listed below. Disallowed status change (transition not listed below)
    will return response 406 error code.
      - **for label task**
        - *unassigned*  -> *open*        - check if task has assigned user
        - *unassigned*  -> *cancelled*   - just change status
        - *open*        -> *in_progress* - just change status
        - *open*        -> *cancelled*   - just change status
        - *in_progress* -> *cancelled*   - TODO: can be called but action has to be implemented
        - *in_progress* -> *done*        - mark every dicom in task as labeled
      - **for annotation task**
        - *unassigned*  -> *open*        - check if task has assigned user
        - *unassigned*  -> *cancelled*   - just change status
        - *open*        -> *in_progress* - create annotation objects for each label assignment in task
        - *open*        -> *cancelled*   - just change status
        - *in_progress* -> *cancelled*   - TODO: not implemented yet
        - *in_progress* -> *done*
          - check if each annotation has at least one data blob, if not raise error
          - change status of each annotation to *done*
          - add time spent on each annotation and save it in task
          - optionally remove draft data for each annotation (all *AnnotationData* objects except the last one)
      - **for annotation review task**
        - *unassigned*  -> *open*        - check if task has assigned user
        - *unassigned*  -> *cancelled*   - just change status
        - *open*        -> *in_progress* - create review objects for each annotation in task
        - *open*        -> *cancelled*   - just change status
        - *in_progress* -> *cancelled*   - TODO: not implemented yet
        - *in_progress* -> *done*
          - check if review has result field filled
          - if result == denied_corrected check if resulting annotation exists and has at least one data blob
          - add time spent on each resulting annotation and save it in task
    """
    task = crud.task.get(db, id=task_id)

    helpers.validate_access_to_task(task, current_user, [schemas.RoleType.task_admin])
    assert task
    change_status_fn: dict[
        schemas.TaskType,
        Callable[[Session, models.Task, schemas.TaskStatus, bool], models.Task],
    ] = {
        schemas.TaskType.label_assignment: logic.task.change_label_task_status,
        schemas.TaskType.annotation: logic.task.change_annotation_task_status,
        schemas.TaskType.annotation_review: logic.task.change_annotation_review_task_status,
    }

    try:
        task = change_status_fn[task.task_type](db, task, new_status)  # type: ignore
    except core.LogicError as error:
        if error.error_code == core.LogicErrorCode.invalid_status_change:
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
                detail=f"Status change from {task.status} to {new_status.value} is not allowed.",
            ) from error
        if error.error_code == core.LogicErrorCode.task_missing_assigned_user:
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
                detail="Task does not have value for assigned_user_id. Please assign user first.",
            ) from error
        if error.error_code == core.LogicErrorCode.annotation_missing_data_blob:
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
                detail=f"Annotation with id={error.extra['id']} does not have data.",
            ) from error

    assert isinstance(task, models.Task)
    return helpers.convert_task_nested_to_ids(task)


@router.post("/change_owner/{task_id}", response_model=schemas.TaskApiOut)
def change_task_owner(
    *,
    db: Session = Depends(deps.get_db),
    new_owner_id: int,
    task_id: int,
    current_user: models.User = Depends(
        deps.get_current_user_with_role(
            [schemas.RoleType.annotator, schemas.RoleType.task_admin]
        )
    ),
) -> models.Task | schemas.Task:
    """
    Update task owner (assigned user).
    """
    task = crud.task.get(db, id=task_id)
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task does not exist.",
        )

    if not (
        task.status == schemas.TaskStatus.unassigned
        or task.status == schemas.TaskStatus.open
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot change owner of modified task.",
        )

    new_owner = crud.user.get(db, id=new_owner_id)
    if new_owner is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User does not exist."
        )

    task.assigned_user_id = new_owner_id  # type: ignore
    task.status = schemas.TaskStatus.open  # type: ignore
    db.commit()

    return helpers.convert_task_nested_to_ids(task)


@router.get(
    "/get_available_statuses/{task_id}",
    response_model=schemas.AvailableStatusesForTaskApiOut,
)
def get_available_statuses_for_task(
    *,
    db: Session = Depends(deps.get_db),
    task_id: int,
    current_user: models.User = Depends(
        deps.get_current_user_with_role(
            [schemas.RoleType.annotator, schemas.RoleType.task_admin]
        )
    ),
):
    task = crud.task.get(db, id=task_id)

    helpers.validate_access_to_task(task, current_user, [schemas.RoleType.task_admin])
    assert task

    available_statuses: dict[schemas.TaskType, dict[schemas.TaskStatus, Any]] = {
        schemas.TaskType.label_assignment: logic.task.label_task_status_flows,
        schemas.TaskType.annotation: logic.task.annotation_task_status_flows,
        schemas.TaskType.annotation_review: logic.task.annotation_review_task_status_flows,
    }

    available_statuses_for_task_type = available_statuses[
        schemas.TaskType(task.task_type)
    ]

    return schemas.AvailableStatusesForTaskApiOut(
        statuses=[
            status
            for status in available_statuses_for_task_type.get(
                schemas.TaskStatus(task.status), {}
            ).keys()
        ]
    )
