from typing import Union

from sqlalchemy.orm import Session, Query

from app import models, schemas
from app.query.base import QueryBase


class QueryRole(QueryBase[models.Role]):
    def query_by_type(self, db: Session, type: Union[schemas.RoleType, str]) -> Query:
        return self.query(db).filter(models.Role.type == type)


role = QueryRole(models.Role)
