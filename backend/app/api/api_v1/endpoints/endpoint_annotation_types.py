from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas, query
from app.api import deps

router = APIRouter()


@router.post("/", response_model=schemas.AnnotationTypeApiOut)
def create_annotation_type(
    *,
    db: Session = Depends(deps.get_db),
    annotation_type_in: schemas.AnnotationTypeCreateApiIn,
    current_user: models.User = Depends(deps.get_current_user_with_role([schemas.RoleType.data_admin])),
) -> Any:
    """
    Create an annotation type.
    """
    annotation_type = query.annotation_type.query_by_name(db, name=annotation_type_in.name).first()
    if annotation_type:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"AnnotationType with name={annotation_type_in.name} is already in database.",
        )
    annotation_type_in = schemas.AnnotationTypeCreateCrud(**annotation_type_in.dict())
    annotation_type = crud.annotation_type.create(db, obj_in=annotation_type_in)

    return annotation_type


@router.get("/", response_model=list[schemas.AnnotationTypeApiOut])
def read_all_annotation_types(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user_with_role(schemas.RoleType.all_roles())),
):
    """
    Read all annotation types.
    """
    annotation_types = crud.annotation_type.get_multi(db, skip=skip, limit=limit)

    return annotation_types


@router.put("/{id}", response_model=schemas.AnnotationTypeApiOut)
def update_annotation_type(
    *,
    db: Session = Depends(deps.get_db),
    annotation_type_in: schemas.AnnotationTypeUpdateApiIn,
    id: int,
    current_user: models.User = Depends(deps.get_current_user_with_role([schemas.RoleType.data_admin])),
):
    """
    Update an annotation type.
    """
    annotation_type = crud.annotation_type.get(db, id=id)

    if annotation_type is None:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"AnnotationType with id={id} does not exist.",
        )

    annotation_type_update = schemas.AnnotationTypeUpdateCrud.parse_obj(annotation_type_in)

    annotation_type = crud.annotation_type.update(
        db, db_obj=annotation_type, obj_in=annotation_type_update
    )

    return annotation_type
