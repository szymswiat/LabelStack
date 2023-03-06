from typing import Generator, List, Callable

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app import crud, models, schemas, query
from app.core import security, logic
from app.core.config import settings
from app.db.session import SessionLocal
from app.schemas.schema_role import RoleType

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> models.User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = crud.user.get(db, id=token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_current_user_with_role(
    role_types: List[RoleType] = None,
    check_active: bool = True,
    allow_no_roles: bool = False,
) -> Callable[[models.User], models.User]:
    if role_types is None:
        role_types = []
    # give access to all APIs to superusers
    if RoleType.superuser not in role_types:
        role_types.append(RoleType.superuser)

    def func(current_user: models.User = Depends(get_current_user)) -> models.User:
        if check_active:
            if not logic.user.is_active(current_user):
                raise HTTPException(status_code=400, detail="The user is not active.")
        if allow_no_roles:
            return current_user
        if logic.user.has_role_one_of(current_user, role_types):
            return current_user
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges."
        )

    return func
