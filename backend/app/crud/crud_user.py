from typing import Any
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app import models, schemas, query


class CRUDUser(CRUDBase[models.User, schemas.UserCreate, schemas.UserUpdate]):
    def schema_to_model_create(
        self, db: Session, *, create_obj: schemas.UserCreate
    ) -> models.User:
        role_ids = create_obj.role_ids if create_obj.role_ids else []
        roles = db.query(models.Role).filter(models.Role.id.in_(role_ids)).all()

        user_attrs = create_obj.dict(exclude={"role_ids", "password"})

        user = models.User(
            **user_attrs,
            hashed_password=get_password_hash(create_obj.password),
            roles=roles
        )
        return user

    def schema_to_model_update(
        self,
        db: Session,
        *,
        db_obj: models.User,
        update_obj: schemas.UserUpdate | dict[str, Any]
    ):
        if isinstance(update_obj, dict):
            update_data = update_obj
        else:
            update_data = update_obj.dict(exclude_unset=True)
        if "password" in update_data:
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password

        if "role_ids" in update_data:
            roles = (
                db.query(models.Role)
                .filter(models.Role.id.in_(update_obj.role_ids))  # type: ignore
                .all()
            )
            update_data["roles"] = roles

        self.set_matching_fields(update_data, db_obj)
        return db_obj

    def authenticate(
        self, db: Session, *, email: str, password: str
    ) -> models.User | None:
        user = query.user.query_by_email(db, email=email).first()
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user


user = CRUDUser(models.User)
