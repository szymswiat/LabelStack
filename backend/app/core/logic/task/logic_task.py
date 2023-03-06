from app import models


def has_image_instance(task: models.Task, image_instance_id: int):
    for image_instance in task.image_instances:
        if image_instance.id == image_instance_id:
            return True
    return False
