from typing import Optional

from sqlalchemy.orm import Session, Query

from app import models, schemas
from app.query.base import QueryBase


class QueryLabelAssignment(QueryBase[models.LabelAssignment]):
    def query_for_not_annotated(
        self, db: Session, query_in: Optional[Query] = None
    ) -> Query:
        done_annotations = (
            db.query(models.Annotation.label_assignment_id)
            .filter(models.Annotation.status == schemas.AnnotationStatus.done)
            .distinct()
        ).subquery()

        query_in = self.query(db, query_in).filter(
            models.LabelAssignment.id.notin_(
                db.query(done_annotations.c.label_assignment_id)
            )
        )

        return query_in

    def query_without_active_task(
        self, *, db: Session, query_in: Optional[Query] = None
    ) -> Query:
        active_tasks_by_type = (
            db.query(models.Task.id)
            .filter(models.Task.task_type == schemas.TaskType.annotation)
            .filter(models.Task.status.in_(schemas.TaskStatus.active_statuses()))
        ).subquery()
        assignments_with_active_task = (
            db.query(models.TaskLabelAssignment.label_assignment_id).join(
                active_tasks_by_type,
                active_tasks_by_type.c.id == models.TaskLabelAssignment.task_id,
            )
        ).subquery()

        return self.query(db, query_in).filter(
            models.LabelAssignment.id.notin_(
                db.query(assignments_with_active_task.c.label_assignment_id)
            )
        )


label_assignment = QueryLabelAssignment(models.LabelAssignment)
