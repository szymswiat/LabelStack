from sqlalchemy.orm import Session, Query

from app import models
from app.query.base import QueryBase


Query = Query[models.Label]


class QueryLabel(QueryBase[models.Label]):
    def query_by_name(self, db: Session, name: str) -> Query:
        return self.query(db).filter(models.Label.name == name)

    def query_by_type_name(self, db: Session, name: str) -> Query:
        return (
            self.query(db)
            .join(models.Label.types)
            .filter(models.LabelType.name == name)
        )

    def query_by_allowed_annotation_type_name(self, db: Session, name: str) -> Query:
        return (
            self.query(db)
            .join(models.AnnotationType)
            .filter(models.AnnotationType.name == name)
        )


label = QueryLabel(models.Label)
