from sqlalchemy.orm import Session, Query

from app import models, schemas
from app.query.base import QueryBase


Query = Query[models.LabelAssignment]


class QueryLabelAssignment(QueryBase[models.LabelAssignment]):
    def query_for_not_annotated(
        self,
        db: Session,
        query_in: Query | None = None,
    ) -> Query:
        done_annotations = (
            db.query(models.Annotation.label_assignment_id)
            .filter(models.Annotation.status == schemas.AnnotationStatus.done)
            .distinct()
        ).subquery()

        return self.query(db, query_in).filter(
            models.LabelAssignment.id.notin_(db.query(done_annotations.c.label_assignment_id))
        )

    def query_without_active_task(
        self,
        *,
        db: Session,
        query_in: Query | None = None,
    ) -> Query:
        active_tasks_by_type = (
            db.query(models.Task.id)
            .filter(models.Task.task_type == schemas.TaskType.annotation)
            .filter(models.Task.status.in_(schemas.TaskStatus.active_statuses()))
        ).subquery()
        assignments_with_active_task = (
            db.query(models.TaskLabelAssignment.label_assignment_id)
            .join(
                active_tasks_by_type,
                active_tasks_by_type.c.id == models.TaskLabelAssignment.task_id,
            )
            .subquery()
        )

        return self.query(db, query_in).filter(
            models.LabelAssignment.id.notin_(
                db.query(assignments_with_active_task.c.label_assignment_id)
            )
        )

    def query_for_finished(
        self,
        *,
        db: Session,
        query_in: Query | None = None,
    ) -> Query:

        finished_tasks = (
            db.query(models.Task.id)
            .filter(models.Task.task_type == schemas.TaskType.label_assignment)
            .filter(models.Task.status.in_([schemas.TaskStatus.done]))
        ).subquery()

        return self.query(db, query_in).filter(
            models.LabelAssignment.parent_task_id == finished_tasks.c.id
        )


label_assignment = QueryLabelAssignment(models.LabelAssignment)
