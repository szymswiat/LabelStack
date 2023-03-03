from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import EmailStr

from app import crud, schemas, query, models
from app.api.api_v1.endpoints.endpoint_dicoms import sync_dicomweb
from app.core.config import settings
from app.db import base  # noqa: F401 # type: ignore

# make sure all SQL Alchemy models are imported (app.db.base) before initializing DB
# otherwise, SQL Alchemy might fail to initialize relationships properly
# for more details: https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/28
from app.db.init.initial_data_gen import (
    labels_create_data,
    tags_create_data,
    annotation_types_create_data,
)
from app.tests.utils.gen_test_users import test_users_meta


def create_user(db: Session, email: str, password: str, roles: list[models.Role]) -> models.User:
    user = query.user.query_by_email(db, email=email).first()
    if not user:
        user_in = schemas.UserCreate(
            email=EmailStr(email),
            password=password,
            role_ids=[role.id for role in roles],
        )
        user = crud.user.create(db, obj_in=user_in)  # noqa: F841

    return user


def init_db(db: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next line
    # Base.metadata.create_all(bind=engine)

    if settings.ENV != "prod":
        clear_db(db)

    if len(crud.role.get_multi(db)) == 0:
        for role_type in schemas.RoleType:
            crud.role.create(db, obj_in=schemas.RoleCreateCrud(type=role_type))

    superuser_role = query.role.query_by_type(db, type=schemas.RoleType.superuser).first()
    assert superuser_role

    superuser = create_user(
        db,
        email=settings.FIRST_SUPERUSER,
        password=settings.FIRST_SUPERUSER_PASSWORD,
        roles=[superuser_role],
    )

    tags_data = tags_create_data()
    crud.tag.create_bulk(db, objs_in=tags_data)

    annotation_types_data = annotation_types_create_data()
    crud.annotation_type.create_bulk(db, objs_in=annotation_types_data)

    if "dev" not in settings.ENV:
        return

    for role_type, user_meta_list in test_users_meta.items():
        role = query.role.query_by_type(db, type=role_type).first()
        assert role
        for user_meta in user_meta_list:
            create_user(
                db,
                email=user_meta.email,
                password=user_meta.password,
                roles=[role],
            )

    labels_data = labels_create_data(db)
    crud.label.create_many(db, objs_in=labels_data)

    sync_dicomweb(db=db, current_user=superuser)


def clear_db(db: Session):
    db.execute(
        text(
            """truncate table
               label__label_type, user__role, task__label_assignment, task__image_instance, image_instance, task__annotation,
               annotation_review, annotation, annotation_data, label_assignment, task, role, label_type,
               label, dicom, app.public."user", tag, dicom_tag_value, image_instance_tag_value, annotation_type;
            """
        )
    )
    db.commit()
