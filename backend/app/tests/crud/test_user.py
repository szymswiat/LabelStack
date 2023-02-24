from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app import crud, query
from app.core import logic
from app.core.security import verify_password
from app.schemas.schema_role import RoleType
from app.schemas.schema_user import UserCreate, UserUpdate
from app.tests.utils.utils import random_email, random_lower_string


def test_create_user(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user = crud.user.create(db, obj_in=user_in)
    assert user.email == email
    assert hasattr(user, "hashed_password")


def test_authenticate_user(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user = crud.user.create(db, obj_in=user_in)
    authenticated_user = crud.user.authenticate(db, email=email, password=password)
    assert authenticated_user
    assert user.email == authenticated_user.email


def test_not_authenticate_user(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    user = crud.user.authenticate(db, email=email, password=password)
    assert user is None


def test_check_if_user_is_active(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user = crud.user.create(db, obj_in=user_in)
    is_active = logic.user.is_active(user)
    assert is_active is True


def test_check_if_user_is_active_inactive(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user = crud.user.create(db, obj_in=user_in)
    is_active = logic.user.is_active(user)
    assert is_active


def test_check_if_user_is_superuser(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    superuser_role = query.role.query_by_type(db, type=RoleType.superuser).first()
    assert superuser_role
    user_in = UserCreate(email=email, password=password, role_ids=[superuser_role.id])
    user = crud.user.create(db, obj_in=user_in)
    has_superuser_role = logic.user.has_role_one_of(user, [RoleType.superuser])
    assert has_superuser_role is True


def test_check_if_user_is_superuser_normal_user(db: Session) -> None:
    username = random_email()
    password = random_lower_string()
    annotator_role = query.role.query_by_type(db, type=RoleType.annotator).first()
    assert annotator_role
    user_in = UserCreate(email=username, password=password, role_ids=[annotator_role.id])
    user = crud.user.create(db, obj_in=user_in)
    has_superuser_role = logic.user.has_role_one_of(user, [RoleType.superuser])
    assert has_superuser_role is False


def test_get_user(db: Session) -> None:
    password = random_lower_string()
    username = random_email()
    superuser_role = query.role.query_by_type(db, type=RoleType.superuser).first()
    assert superuser_role
    user_in = UserCreate(email=username, password=password, role_ids=[superuser_role.id])
    user = crud.user.create(db, obj_in=user_in)
    user_2 = crud.user.get(db, id=user.id)
    assert user_2
    assert user.email == user_2.email
    assert jsonable_encoder(user) == jsonable_encoder(user_2)


def test_update_user(db: Session) -> None:
    password = random_lower_string()
    email = random_email()
    superuser_role = query.role.query_by_type(db, type=RoleType.superuser).first()
    assert superuser_role
    user_in = UserCreate(email=email, password=password, role_ids=[superuser_role.id])
    user = crud.user.create(db, obj_in=user_in)
    new_password = random_lower_string()
    user_in_update = UserUpdate(password=new_password, role_ids=[superuser_role.id])
    crud.user.update(db, db_obj=user, obj_in=user_in_update)
    user_2 = crud.user.get(db, id=user.id)
    assert user_2
    assert user.email == user_2.email
    assert verify_password(new_password, user_2.hashed_password)
