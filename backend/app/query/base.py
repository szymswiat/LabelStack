from typing import Generic, Type, TypeVar, Optional

from sqlalchemy.orm import Session, Query

from app.db.base_class import Base

ModelType = TypeVar("ModelType", bound=Base)


class QueryBase(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def query(self, db: Session, query_in: Optional[Query] = None) -> Query:
        if query_in is None:
            query_in = db.query(self.model)
        return query_in
