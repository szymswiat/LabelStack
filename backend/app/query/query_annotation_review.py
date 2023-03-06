from typing import List

from sqlalchemy.orm import Session, Query

from app import models, schemas
from app.query.base import QueryBase


class QueryAnnotationReview(QueryBase[models.AnnotationReview]):
    def query_for_reviews_with_annotation(
        self, db: Session, annotation_id: int
    ) -> Query:
        return self.query(db).filter(
            models.AnnotationReview.annotation_id == annotation_id
        )

    def query_open_reviews_for_annotations(
        self, db: Session, annotation_ids: List[int]
    ) -> Query:
        return (
            self.query(db)
            .filter(models.AnnotationReview.annotation_id.in_(annotation_ids))
            .filter(
                models.AnnotationReview.status == schemas.AnnotationReviewStatus.open
            )
        )

    def query_by_task_dicom_label(
        self, db: Session, task_id: int, dicom_id: int, label_id: int
    ):
        return (
            self.query(db)
            .filter(models.AnnotationReview.parent_task_id == task_id)
            .join(
                models.Annotation,
                models.Annotation.id == models.AnnotationReview.annotation_id,
            )
            .filter(models.Annotation.dicom_id == dicom_id)
            .filter(models.Annotation.label_id == label_id)
        )

    def query_by_task(self, db: Session, task_id: int) -> Query:
        return self.query(db).filter(models.AnnotationReview.parent_task_id == task_id)


annotation_review = QueryAnnotationReview(models.AnnotationReview)
