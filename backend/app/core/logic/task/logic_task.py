from app import models


def has_image_instance(task: models.Task, image_instance_id: int):
    return image_instance_id in [ii.id for ii in task.image_instances]
