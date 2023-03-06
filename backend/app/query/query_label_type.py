from sqlalchemy.orm import Session, Query

from app import models
from app.query.base import QueryBase


class QueryLabelType(QueryBase[models.LabelType]):
    def query_by_name(self, db: Session, name: str) -> Query:
        return self.query(db).filter(models.LabelType.name == name)


label_type = QueryLabelType(models.LabelType)
