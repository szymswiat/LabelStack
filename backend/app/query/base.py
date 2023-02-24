from typing import Generic, Type, TypeVar

from sqlalchemy.orm import Session, Query

from app.db.base_class import Base

T_co = TypeVar("T_co", bound=Base)


class QueryBase(Generic[T_co]):
    def __init__(self, model: Type[T_co]):
        self.model = model

    def query(self, db: Session, query_in: Query[T_co] | None = None) -> Query[T_co]:
        if query_in is None:
            query_in = db.query(self.model)
        return query_in
