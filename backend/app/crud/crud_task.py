from sqlalchemy.orm import Session

from app import crud
from app import models, schemas
from app.crud.base import CRUDBase


class CRUDTask(CRUDBase[models.Task, schemas.TaskCreateCrud, schemas.TaskUpdateCrud]):
    def schema_to_model_create(
        self, db: Session, *, create_obj: schemas.TaskCreateCrud
    ) -> models.Task:

        assert create_obj.image_instance_ids is not None
        assert create_obj.label_assignment_ids is not None
        assert create_obj.annotation_ids is not None

        image_instances = crud.image_instance.get_multi_by_ids(
            db, ids=create_obj.image_instance_ids
        )
        labels_assignments = crud.label_assignment.get_multi_by_ids(
            db, ids=create_obj.label_assignment_ids
        )
        annotations = crud.annotation.get_multi_by_ids(
            db, ids=create_obj.annotation_ids
        )

        task_attrs = create_obj.dict(
            exclude={"image_instance_ids", "label_assignment_ids", "annotation_ids"}
        )

        return models.Task(
            **task_attrs,
            image_instances=image_instances,
            label_assignments=labels_assignments,
            annotations=annotations
        )


task = CRUDTask(models.Task)
