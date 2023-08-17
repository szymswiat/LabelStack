from sqlalchemy.orm import Session, Query

from app import models, schemas
from app.query.base import QueryBase


Query = Query[models.ImageInstance]


class QueryImageInstance(QueryBase[models.ImageInstance]):
    def query_by_id_ref(self, db: Session, *, id_ref: str) -> Query:
        return self.query(db).filter(models.ImageInstance.id_ref == id_ref)

    def query_without_active_task(self, *, db: Session, query_in: Query | None = None) -> Query:
        active_tasks_by_type = (
            db.query(models.Task.id)
            .filter(models.Task.task_type == schemas.TaskType.label_assignment)
            .filter(models.Task.status.in_(schemas.TaskStatus.active_statuses()))
        ).subquery()
        images_with_active_task = (
            db.query(models.TaskImageInstance.image_instance_id).join(
                active_tasks_by_type,
                active_tasks_by_type.c.id == models.TaskImageInstance.task_id,
            )
        ).subquery()

        return self.query(db, query_in).filter(
            models.ImageInstance.id.notin_(db.query(images_with_active_task.c.image_instance_id))
        )


image_instance = QueryImageInstance(models.ImageInstance)
