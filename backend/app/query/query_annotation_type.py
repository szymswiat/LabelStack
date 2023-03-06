from sqlalchemy.orm import Session, Query

from app import models
from app.query.base import QueryBase


class QueryAnnotationType(QueryBase[models.AnnotationType]):
    def query_by_name(self, db: Session, name: str) -> Query:
        return self.query(db).filter(models.AnnotationType.name == name)


annotation_type = QueryAnnotationType(models.AnnotationType)
