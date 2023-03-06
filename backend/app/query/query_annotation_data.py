from sqlalchemy.orm import Session, Query, undefer

from app import models
from app.query.base import QueryBase


class QueryAnnotationData(QueryBase[models.AnnotationData]):
    def query_by_key(self, db: Session, annotation_id: int, sequence: int) -> Query:
        return (
            self.query(db)
            .filter(models.AnnotationData.annotation_id == annotation_id)
            .filter(models.AnnotationData.sequence == sequence)
        )

    def query_by_annotation(self, db: Session, annotation_id: int) -> Query:
        return self.query(db).filter(
            models.AnnotationData.annotation_id == annotation_id
        )


annotation_data = QueryAnnotationData(models.AnnotationData)
