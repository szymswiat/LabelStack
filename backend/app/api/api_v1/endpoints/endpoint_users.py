from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session

from app import crud, models, schemas, query
from app.api import deps
from app.core.config import settings


router = APIRouter()


@router.get("/", response_model=list[schemas.UserResponse])
def read_all_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(
        deps.get_current_user_with_role([schemas.RoleType.task_admin, schemas.RoleType.data_admin])
    ),
) -> Any:
    """
    Retrieve users.
    """
    users = crud.user.get_multi(db, skip=skip, limit=limit)
    return users


@router.post("/", response_model=schemas.UserResponse)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
    current_user: models.User = Depends(deps.get_current_user_with_role()),
) -> Any:
    """
    Create new user.
    """
    user = query.user.query_by_email(db, email=user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The user with this username already exists in the system.",
        )
    user = crud.user.create(db, obj_in=user_in)
    return user


@router.put("/me", response_model=schemas.UserResponse)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    password: str | None = Body(None),
    full_name: str | None = Body(None),
    email: EmailStr | None = Body(None),
    current_user: models.User = Depends(deps.get_current_user_with_role(allow_no_roles=True)),
) -> Any:
    """
    Update own user.
    """
    current_user_data = jsonable_encoder(current_user)
    user_in = schemas.UserUpdate(**current_user_data)
    if password is not None:
        user_in.password = password
    if full_name is not None:
        user_in.full_name = full_name
    if email is not None:
        user_in.email = email
    user = crud.user.update(db, db_obj=current_user, obj_in=user_in)
    return user


@router.get("/me", response_model=schemas.UserResponse)
def read_user_me(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user_with_role(allow_no_roles=True)),
) -> Any:
    """
    Get current user.
    """
    return current_user


@router.post("/open", response_model=schemas.UserResponse)
def create_user_open(
    *,
    db: Session = Depends(deps.get_db),
    password: str = Body(...),
    email: EmailStr = Body(...),
    full_name: str = Body(None),
) -> Any:
    """
    Create new user without the need to be logged in.
    """
    if not settings.USERS_OPEN_REGISTRATION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Open user registration is forbidden on this server",
        )
    user = query.user.query_by_email(db, email=email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The user with this username already exists in the system",
        )
    user_in = schemas.UserCreate(password=password, email=email, full_name=full_name)
    user = crud.user.create(db, obj_in=user_in)
    return user


@router.get("/{user_id}", response_model=schemas.UserResponse)
def read_user_by_id(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user_with_role()),
) -> Any:
    """
    Get a specific user by id.
    """
    user = crud.user.get(db, id=user_id)
    return user


@router.put("/{user_id}", response_model=schemas.UserResponse)
def update_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(deps.get_current_user_with_role(schemas.RoleType.all_roles())),
) -> Any:
    """
    Update a user.
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="The user with this username does not exist in the system",
        )

    if schemas.RoleType.superuser not in [role.type for role in current_user.roles]:

        if user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )

        user_in = schemas.UserUpdateMe(**user_in.dict())  # type: ignore

    user = crud.user.update(db, db_obj=user, obj_in=user_in)
    return user
