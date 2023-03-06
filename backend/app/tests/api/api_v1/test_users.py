from typing import Dict

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud, query, schemas
from app.core.config import settings
from app.tests.utils.utils import random_email, random_lower_string


# TODO: include roles


def test_get_users_superuser_me(
    client: TestClient, superuser_token_headers: Dict[str, str]
) -> None:
    r = client.get(f"{settings.API_V1_STR}/users/me", headers=superuser_token_headers)
    assert 200 <= r.status_code < 300

    current_user = r.json()
    assert current_user
    assert current_user["is_active"] is True
    # assert current_user["is_superuser"] TODO:
    assert current_user["email"] == settings.FIRST_SUPERUSER


def test_get_users_normal_user_me(
    client: TestClient, normal_user_token_headers: Dict[str, str]
) -> None:
    r = client.get(f"{settings.API_V1_STR}/users/me", headers=normal_user_token_headers)
    assert 200 <= r.status_code < 300

    current_user = r.json()
    assert current_user
    assert current_user["is_active"] is True
    # assert current_user["is_superuser"] is False TODO:
    assert current_user["email"] == settings.TEST_USER_EMAIL


def test_create_user_new_email(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    username = random_email()
    password = random_lower_string()
    data = schemas.UserCreate.parse_obj(
        {"email": username, "password": password, "role_ids": []}
    )
    r = client.post(
        f"{settings.API_V1_STR}/users/",
        headers=superuser_token_headers,
        json=data.dict(),
    )
    assert 200 <= r.status_code < 300
    created_user = r.json()
    user = query.user.query_by_email(db, email=username).first()
    assert user
    assert user.email == created_user["email"]


def test_get_existing_user(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    username = random_email()
    password = random_lower_string()
    user_in = schemas.UserCreate(email=username, password=password)
    user = crud.user.create(db, obj_in=user_in)
    user_id = user.id
    r = client.get(
        f"{settings.API_V1_STR}/users/{user_id}",
        headers=superuser_token_headers,
    )
    assert 200 <= r.status_code < 300
    api_user = r.json()
    existing_user = query.user.query_by_email(db, email=username).first()
    assert existing_user
    assert existing_user.email == api_user["email"]


def test_create_user_existing_username(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    username = random_email()
    # username = email
    password = random_lower_string()
    user_in = schemas.UserCreate(email=username, password=password)
    crud.user.create(db, obj_in=user_in)
    data = schemas.UserCreate.parse_obj(
        {"email": username, "password": password, "role_ids": []}
    )
    r = client.post(
        f"{settings.API_V1_STR}/users/",
        headers=superuser_token_headers,
        json=data.dict(),
    )
    created_user = r.json()
    assert r.status_code == 409
    assert "_id" not in created_user


def test_create_user_by_normal_user(
    client: TestClient, normal_user_token_headers: Dict[str, str]
) -> None:
    username = random_email()
    password = random_lower_string()
    data = schemas.UserCreate.parse_obj(
        {"email": username, "password": password, "role_ids": []}
    )
    r = client.post(
        f"{settings.API_V1_STR}/users/",
        headers=normal_user_token_headers,
        json=data.dict(),
    )
    assert r.status_code == 400


def test_retrieve_users(
    client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    username = random_email()
    password = random_lower_string()
    user_in = schemas.UserCreate(email=username, password=password)
    crud.user.create(db, obj_in=user_in)

    username2 = random_email()
    password2 = random_lower_string()
    user_in2 = schemas.UserCreate(email=username2, password=password2)
    crud.user.create(db, obj_in=user_in2)

    r = client.get(f"{settings.API_V1_STR}/users/", headers=superuser_token_headers)
    all_users = r.json()

    assert len(all_users) > 1
    for item in all_users:
        assert "email" in item
