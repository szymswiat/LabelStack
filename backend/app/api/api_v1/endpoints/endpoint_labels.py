from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas, query
from app.api import deps

router = APIRouter()


@router.post("/", response_model=schemas.LabelApiOut)
def create_label(
    *,
    db: Session = Depends(deps.get_db),
    label_in: schemas.LabelCreateApiIn,
    current_user: models.User = Depends(
        deps.get_current_user_with_role([schemas.RoleType.data_admin])
    ),
) -> Any:
    """
    Create a label.
    """
    label = query.label.query_by_name(db, name=label_in.name).first()
    if label:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Label with name={label_in.name} is already in database.",
        )
    label_in = schemas.LabelCreateCrud(**label_in.dict())
    label = crud.label.create(db, obj_in=label_in)

    return label


@router.get("/", response_model=list[schemas.LabelApiOut])
def read_labels(
    *,
    db: Session = Depends(deps.get_db),
    with_label_type_name: str | None = None,
    with_allowed_annotation_type_name: str | None = None,
    current_user: models.User = Depends(
        deps.get_current_user_with_role(schemas.RoleType.all_roles())
    ),
):
    """
    Read all labels.
    """
    if with_label_type_name and with_allowed_annotation_type_name:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Only one filter (with_label_type_name, with_allowed_annotation_type_name) is allowed.",
        )

    query_out = query.label.query(db)
    if with_label_type_name:
        query_out = query.label.query_by_type_name(db, with_label_type_name)
    if with_allowed_annotation_type_name:
        query_out = query.label.query_by_allowed_annotation_type_name(
            db, with_allowed_annotation_type_name
        )

    return query_out.all()


@router.put("/{id}", response_model=schemas.LabelApiOut)
def update_label(
    *,
    db: Session = Depends(deps.get_db),
    label_in: schemas.LabelUpdateApiIn,
    id: int,
    current_user: models.User = Depends(
        deps.get_current_user_with_role([schemas.RoleType.data_admin])
    ),
):
    """
    Update a label.
    """
    label = crud.label.get(db, id=id)

    if not label:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"Label with given id={id} does not exist.",
        )

    label_in = schemas.LabelUpdateCrud.parse_obj(label_in.dict())
    label = crud.label.update(db, db_obj=label, obj_in=label_in)

    return label
