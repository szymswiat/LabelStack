from typing import Any, Generic, Type, TypeVar

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.base_class import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).

        **Parameters**

        * `model`: A SQLAlchemy model class
        * `schema`: A Pydantic model (schema) class
        """
        self.model = model

    def get(self, db: Session, id: Any) -> ModelType | None:
        return db.query(self.model).filter(self.model.id == id).first()

    def get_multi_by_ids(self, db: Session, ids: list[int]) -> list[ModelType]:
        return db.query(self.model).filter(self.model.id.in_(ids)).all()

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> list[ModelType]:
        return db.query(self.model).offset(skip).limit(limit).all()

    def create(
        self, db: Session, *, obj_in: CreateSchemaType, commit: bool = True
    ) -> ModelType:
        db_obj = self.schema_to_model_create(db, create_obj=obj_in)
        db.add(db_obj)
        db.flush([db_obj])
        if commit:
            db.commit()
        db.refresh(db_obj)
        return db_obj

    def create_bulk(
        self, db: Session, *, objs_in: list[CreateSchemaType], commit: bool = True
    ):
        db_objs = [
            self.schema_to_model_create(db, create_obj=obj_in) for obj_in in objs_in
        ]

        db.bulk_save_objects(db_objs)
        db.flush(db_objs)
        if commit:
            db.commit()

    def create_many(
        self, db: Session, *, objs_in: list[CreateSchemaType], commit: bool = True
    ):
        db_objs = [
            self.schema_to_model_create(db, create_obj=obj_in) for obj_in in objs_in
        ]

        # db.bulk_save_objects(db_objs)
        for db_obj in db_objs:
            db.add(db_obj)
        db.flush(db_objs)
        if commit:
            db.commit()

    def schema_to_model_create(
        self, db: Session, *, create_obj: CreateSchemaType
    ) -> ModelType:
        obj_in_data = self.get_update_data(create_obj)
        return self.model(**obj_in_data)

    def schema_to_model_update(
        self, db: Session, *, db_obj: ModelType, update_obj: UpdateSchemaType
    ) -> ModelType:
        update_data = self.get_update_data(update_obj)
        self.set_matching_fields(update_data, db_obj)
        return db_obj

    def update(
        self,
        db: Session,
        *,
        db_obj: ModelType,
        obj_in: UpdateSchemaType,
        commit: bool = True
    ) -> ModelType:
        db_obj = self.schema_to_model_update(db, db_obj=db_obj, update_obj=obj_in)

        db.add(db_obj)
        db.flush([db_obj])
        if commit:
            db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int, commit: bool = True) -> ModelType | None:
        obj = db.query(self.model).get(id)
        db.delete(obj)
        db.flush([obj])
        if commit:
            db.commit()
        return obj

    @staticmethod
    def get_update_data(
        obj_in: dict[str, Any] | BaseModel, exclude_unset: bool = True
    ) -> dict[str, Any]:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=exclude_unset)

        return update_data

    @staticmethod
    def set_matching_fields(update_data: dict[str, Any], db_obj: ModelType):
        obj_data = jsonable_encoder(db_obj)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
