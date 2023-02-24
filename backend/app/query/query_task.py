from sqlalchemy.orm import Session, Query

from app import models, schemas
from app.query.base import QueryBase


Query = Query[models.Task]


class QueryTask(QueryBase[models.Task]):
    def query_active_tasks_with_image_instances(
        self,
        db: Session,
        image_instance_ids: list[int],
        query_in: Query | None = None,
    ) -> Query:
        return (
            self.query(db, query_in)
            .filter(models.Task.task_type == schemas.TaskType.label_assignment)
            .filter(
                models.Task.status.notin_(
                    [schemas.TaskStatus.done, schemas.TaskStatus.cancelled]
                )
            )
            .join(models.Task.image_instances)
            .filter(models.ImageInstance.id.in_(image_instance_ids))
        )

    def query_tasks_with_label_assignments(
        self,
        db: Session,
        label_assignments_ids: list[int],
        statuses: list[schemas.TaskStatus],
    ) -> Query:
        return (
            self.query(db)
            .filter(models.Task.task_type == schemas.TaskType.annotation)
            .filter(models.Task.status.in_(statuses))
            .join(models.Task.label_assignments)
            .filter(models.LabelAssignment.id.in_(label_assignments_ids))
        )

    def query_tasks_with_annotations(
        self,
        db: Session,
        annotation_ids: list[int],
        task_statuses: list[schemas.TaskStatus],
    ) -> Query:
        q = db.query(models.Annotation.parent_task_id).filter(
            models.Annotation.id.in_(annotation_ids)
        )

        return (
            self.query(db)
            .filter(models.Task.id.in_(q))
            .filter(models.Task.status.in_(task_statuses))
            .filter(models.Task.task_type == schemas.TaskType.annotation_review)
        )

    def query_by_status(
        self,
        db: Session,
        *,
        include: bool = True,
        status_list: list[schemas.TaskStatus],
        query_in: Query | None = None
    ) -> Query:
        query = self.query(db, query_in)

        operator = models.Task.status.in_ if include else models.Task.status.notin_
        return query.filter(operator(status_list))

    def query_by_type(
        self, db: Session, task_type: schemas.TaskType, query_in: Query | None = None
    ) -> Query:
        return self.query(db, query_in).filter(models.Task.task_type == task_type)

    def query_by_user(
        self, db: Session, *, user_id: int, query_in: Query | None = None
    ) -> Query:
        query = self.query(db, query_in)
        query = query.filter(models.Task.assigned_user_id == user_id)

        return query


task = QueryTask(models.Task)
