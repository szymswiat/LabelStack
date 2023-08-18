from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas, query
from app.api import deps
from app.api.api_v1 import helpers
from app.core import logic

router = APIRouter()


@router.get("/{id}", response_model=schemas.ImageInstanceApiOut)
def read_image_instance(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_user_with_role()),
) -> models.ImageInstance:
    """
    Read metadata of single image_instance by its **id**.
    """
    image_instance = crud.image_instance.get(db, id=id)

    if not image_instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ImageInstance with id={id} does not exist.",
        )

    return image_instance


@router.get("/", response_model=list[schemas.ImageInstanceApiOut])
def read_image_instances(
    *,
    db: Session = Depends(deps.get_db),
    by_ids: str | None = None,
    without_active_task: bool | None = False,
    current_user: models.User = Depends(
        deps.get_current_user_with_role([schemas.RoleType.data_admin, schemas.RoleType.task_admin])
    ),
) -> list[models.ImageInstance]:
    """
    Read list of image_instance metadata filtered by following options:
      - **by_ids** - returns image instances specified in id list e.g. by_ids=1,2,3,4 ...
      - **without_active_task** - filters image_instance list and returns items that do not have active label assignment task
    """

    if by_ids:
        # TODO: may be unsafe
        return crud.image_instance.get_multi_by_ids(
            db, ids=[int(str_id) for str_id in by_ids.split(",")]
        )

    query_out = query.image_instance.query(db)

    if without_active_task:
        query_out = query.image_instance.query_without_active_task(db=db, query_in=query_out)

    return query_out.all()


@router.get("/for_task/{task_id}", response_model=list[schemas.ImageInstanceApiOut])
def read_image_instances_for_task(
    *,
    db: Session = Depends(deps.get_db),
    task_id: int,
    current_user: models.User = Depends(
        deps.get_current_user_with_role([schemas.RoleType.annotator, schemas.RoleType.task_admin])
    ),
) -> list[models.ImageInstance] | list[schemas.ImageInstance]:
    """
    Read list of image_instances bound to task.
    """
    task = crud.task.get(db, id=task_id)
    helpers.validate_access_to_task(task, current_user, [schemas.RoleType.task_admin])

    assert task

    image_instances = logic.image_instance.get_all_image_instances_for_task(task)
    image_instances = logic.image_instance.filter_image_instances_for_user(
        image_instances, current_user, task
    )

    return image_instances
