from sqlalchemy.orm import Session, Query

from app import models, schemas
from app.query.base import QueryBase


Query = Query[models.Annotation]


class QueryAnnotation(QueryBase[models.Annotation]):
    def query_all_for_label_assignment(
        self,
        db: Session,
        label_assignment_id: int,
    ) -> Query:
        return self.query(db).filter(
            models.Annotation.label_assignment_id == label_assignment_id
        )

    def query_for_annotations_with_status(
        self,
        db: Session,
        *,
        annotation_ids: list[int] | None = None,
        status: schemas.AnnotationStatus
    ) -> Query:
        q = self.query(db).filter(models.Annotation.status == status)

        if annotation_ids is not None:
            q = q.filter(models.Annotation.id.in_(annotation_ids))

        return q

    def query_by_task(self, db: Session, task_id: int) -> Query:
        return self.query(db).filter(models.Annotation.parent_task_id == task_id)

    def query_without_active_task(
        self, db: Session, query_in: Query | None = None
    ) -> Query:
        active_tasks_by_type = (
            db.query(models.Task.id)
            .filter(models.Task.task_type == schemas.TaskType.annotation_review)
            .filter(models.Task.status.in_(schemas.TaskStatus.active_statuses()))
        ).subquery()
        annotations_with_active_task = (
            db.query(models.TaskAnnotation.annotation_id).join(
                active_tasks_by_type,
                active_tasks_by_type.c.id == models.TaskAnnotation.task_id,
            )
        ).subquery()

        return self.query(db, query_in).filter(
            models.Annotation.id.notin_(
                db.query(annotations_with_active_task.c.annotation_id)
            )
        )


annotation = QueryAnnotation(models.Annotation)
