from app import models, schemas


def convert_task_nested_to_ids(
    task: models.Task,
) -> schemas.Task:

    task_obj = schemas.Task.from_orm(task)

    if task_obj.image_instances is not None:
        task_obj.image_instance_ids = [ii.id for ii in task_obj.image_instances]
        task_obj.image_instances = None

    if task_obj.label_assignments is not None:
        task_obj.label_assignment_ids = [la.id for la in task_obj.label_assignments]
        task_obj.label_assignments = None

    if task_obj.annotations is not None:
        task_obj.annotation_ids = [a.id for a in task_obj.annotations]
        task_obj.annotations = None

    return task_obj
