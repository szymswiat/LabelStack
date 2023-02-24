from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas, query
from app.api import deps

router = APIRouter()


@router.post("/", response_model=schemas.LabelTypeApiOut)
def create_label_type(
    *,
    db: Session = Depends(deps.get_db),
    label_type_in: schemas.LabelTypeCreateApiIn,
    current_user: models.User = Depends(deps.get_current_user_with_role([schemas.RoleType.data_admin])),
) -> Any:
    """
    Create a label type.
    """
    label_type = query.label_type.query_by_name(db, name=label_type_in.name).first()
    if label_type:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"LabelType with name={label_type_in.name} is already in database.",
        )
    label_type_in = schemas.LabelTypeCreateCrud(**label_type_in.dict())
    label_type = crud.label_type.create(db, obj_in=label_type_in)

    return label_type


@router.get("/", response_model=list[schemas.LabelTypeApiOut])
def read_all_label_types(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user_with_role(schemas.RoleType.all_roles())),
):
    """
    Read all labels.
    """
    label_types = crud.label_type.get_multi(db, skip=skip, limit=limit)

    return label_types


@router.put("/{id}", response_model=schemas.LabelTypeApiOut)
def update_label_type(
    *,
    db: Session = Depends(deps.get_db),
    label_type_in: schemas.LabelTypeUpdateApiIn,
    id: int,
    current_user: models.User = Depends(deps.get_current_user_with_role([schemas.RoleType.data_admin])),
):
    """
    Update a label type.
    """
    label_type = crud.label_type.get(db, id=id)

    if not label_type:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"LabelType with id={id} does not exist.",
        )

    label_type_update = schemas.LabelTypeUpdateCrud.parse_obj(label_type_in)

    label_type = crud.label_type.update(db, db_obj=label_type, obj_in=label_type_update)

    return label_type
