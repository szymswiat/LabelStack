from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app import crud, models, schemas, query
from app.api import deps
from app.api.api_v1 import helpers
from app.core import logic

router = APIRouter()


@router.post("/add_to_instances", response_model=list[schemas.LabelAssignmentApiOut])
def add_label_assignments(
    *,
    db: Session = Depends(deps.get_db),
    image_instance_ids: list[int] = Query(),
    label_to_add_id: int,
    current_user: models.User = Depends(
        deps.get_current_user_with_role(
            [
                schemas.RoleType.annotator,
                schemas.RoleType.data_admin,
                schemas.RoleType.task_admin,
            ]
        )
    ),
) -> list[models.LabelAssignment]:

    label_to_create = crud.label.get(db, label_to_add_id)

    if label_to_create is None:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"There is no label with id={label_to_add_id}",
        )

    label_assignments_out: list[models.LabelAssignment] = []
    for image_instance_id in image_instance_ids:
        image_instance = crud.image_instance.get(db, id=image_instance_id)

        if image_instance is None:
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
                detail=f"There is no image_instance with id={image_instance_id}",
            )

        if logic.image_instance.has_labels(image_instance, [label_to_create]):
            continue

        label_assignment_in = schemas.LabelAssignmentCreateCrud(
            label_id=label_to_create.id,
            image_instance_id=image_instance_id,
            author_id=current_user.id,
        )
        label_assignment = crud.label_assignment.create(
            db, obj_in=label_assignment_in, commit=False
        )
        label_assignments_out.append(label_assignment)

    db.commit()

    return label_assignments_out


@router.post("/for_image_instance", response_model=list[schemas.LabelAssignmentApiOut])
def modify_label_assignments(
    *,
    db: Session = Depends(deps.get_db),
    label_assignments_in: schemas.LabelAssignmentsModifyApiIn,
    current_user: models.User = Depends(
        deps.get_current_user_with_role([schemas.RoleType.annotator])
    ),
) -> list[models.LabelAssignment]:
    """
    Create group of label annotations for image_instance.
    """
    task = crud.task.get(db, id=label_assignments_in.parent_task_id)
    assert task
    helpers.validate_access_to_task(
        task, current_user, with_one_of_statuses=[schemas.TaskStatus.in_progress]
    )
    helpers.check_if_task_is_editable(task)

    if not logic.task.has_image_instance(task, label_assignments_in.image_instance_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Selected image_instance is not in task.",
        )
    image_instance = crud.image_instance.get(
        db, id=label_assignments_in.image_instance_id
    )

    if image_instance is None:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"There is no image_instance with id={label_assignments_in.image_instance_id}",
        )

    # this will ignore invalid label_ids
    labels_to_create = crud.label.get_multi_by_ids(
        db, label_assignments_in.label_ids_to_create
    )
    label_assignments_out: list[models.LabelAssignment] = []
    for label in labels_to_create:
        if logic.image_instance.has_labels(image_instance, [label]):
            continue

        label_assignment_in = schemas.LabelAssignmentCreateCrud(
            label_id=label.id,
            image_instance_id=label_assignments_in.image_instance_id,
            parent_task_id=label_assignments_in.parent_task_id,
            author_id=current_user.id,
        )
        label_assignment = crud.label_assignment.create(
            db, obj_in=label_assignment_in, commit=False
        )
        label_assignments_out.append(label_assignment)

    logic.image_instance.clear_labels(
        image_instance, label_assignments_in.label_ids_to_remove
    )

    db.commit()

    return label_assignments_out


@router.get("/", response_model=list[schemas.LabelAssignmentApiOut])
def read_label_assignments(
    *,
    db: Session = Depends(deps.get_db),
    waiting_for_annotations: bool | None = False,
    without_active_task: bool | None = False,
    current_user: models.User = Depends(
        deps.get_current_user_with_role(
            [schemas.RoleType.data_admin, schemas.RoleType.task_admin]
        )
    ),
) -> list[schemas.Dicom]:
    """
    Read list of label assignments filtered by following options:
      - **waiting_for_annotations** - returns labels assignments that are not annotated
      - **without_active_task** - filters label assignments and returns items that do not have active annotation task
    """
    query_out = query.label_assignment.query_for_finished(db=db)

    if without_active_task:
        query_out = query.label_assignment.query_without_active_task(
            db=db, query_in=query_out
        )

    if waiting_for_annotations:
        query_out = query.label_assignment.query_for_not_annotated(
            db, query_in=query_out
        )

    return query_out.all()
