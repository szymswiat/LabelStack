from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.RoleApiOut])
def read_all_roles(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(
        deps.get_current_user_with_role(schemas.RoleType.all_roles())
    ),
):
    """
    Read all labels.
    """
    roles = crud.role.get_multi(db, skip=skip, limit=limit)

    return roles


@router.put("/{id}", response_model=schemas.RoleApiOut)
def update_role(
    *,
    db: Session = Depends(deps.get_db),
    role_in: schemas.RoleUpdateCrud,  # TODO: replace with RoleUpdateApiIn or remove
    id: int,
    current_user: models.User = Depends(deps.get_current_user_with_role()),
):
    """
    Update a role.
    """
    role = crud.role.get(db, id=id)

    if not role:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"Role with id={id} does not exist.",
        )

    role = crud.role.update(db, db_obj=role, obj_in=role_in)

    return role
