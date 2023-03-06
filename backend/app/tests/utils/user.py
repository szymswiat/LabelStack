from typing import Dict

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud, query, schemas
from app.core.config import settings
from app.models.model_user import User
from app.schemas.schema_user import UserCreate, UserUpdate
from app.tests.utils.gen_test_users import test_users_meta
from app.tests.utils.utils import random_email, random_lower_string


def user_authentication_headers(
    *, client: TestClient, email: str, password: str
) -> Dict[str, str]:
    data = {"username": email, "password": password}

    r = client.post(f"{settings.API_V1_STR}/login/access-token", data=data)
    response = r.json()
    auth_token = response["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}
    return headers


def create_random_user(db: Session) -> User:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(username=email, email=email, password=password)
    user = crud.user.create(db=db, obj_in=user_in)
    return user


def authentication_token_from_email(
    *, client: TestClient, email: str, db: Session
) -> Dict[str, str]:
    """
    Return a valid token for the user with given email.

    If the user doesn't exist it is created first.
    """
    password = random_lower_string()
    user = query.user.query_by_email(db, email=email).first()
    if not user:
        user_in_create = UserCreate(username=email, email=email, password=password)
        user = crud.user.create(db, obj_in=user_in_create)
    else:
        user_in_update = UserUpdate(password=password)
        user = crud.user.update(db, db_obj=user, obj_in=user_in_update)

    return user_authentication_headers(client=client, email=email, password=password)


def auth_data_for_test_user(
    db: Session, client: TestClient, user_role: schemas.RoleType, user_idx: int
):
    meta_by_role = test_users_meta[user_role]
    assert user_idx < len(meta_by_role)
    user_meta = meta_by_role[user_idx]
    user = query.user.query_by_email(db, email=user_meta["email"]).first()

    headers = user_authentication_headers(
        client=client, email=user_meta["email"], password=user_meta["password"]
    )

    return user, headers
