from itertools import groupby
from typing import List, Dict

from sqlalchemy.orm import Session

from app import models, query, schemas, crud, core


def has_labels(
    image_instance: models.ImageInstance, labels: List[models.Label]
) -> bool:
    image_label_ids = [l.label_id for l in image_instance.label_assignments]
    for label in labels:
        if label.id not in image_label_ids:
            return False
    return True


def clear_labels(image_instance: models.ImageInstance, label_ids: List[int]):
    label_assignments_to_remove = [
        la for la in image_instance.label_assignments if la.label_id in label_ids
    ]
    for label_assignment in label_assignments_to_remove:
        image_instance.label_assignments.remove(label_assignment)


def sync_series_with_image_instances(
    db: Session,
    series_list: List[Dict[str, Dict]],
    tags_by_keyword: Dict[str, models.Tag],
    commit=False,
) -> List[models.ImageInstance]:
    tag_keywords_for_image_instance = [
        "PatientID",
        "Modality",
        "BodyPartExamined",
    ]

    synced_image_instances: List[models.ImageInstance] = []

    for series in series_list:
        tag = tags_by_keyword["SeriesInstanceUID"]
        id_ref = core.logic.dicom.dicomweb_get_tag_value_from_instance(series, tag)
        image_instance = query.image_instance.query_by_id_ref(db, id_ref=id_ref).first()
        if image_instance is not None:
            # TODO: what about updates?
            continue

        image_instance_create = schemas.ImageInstanceCreateCrud(id_ref=id_ref)
        image_instance = crud.image_instance.create(
            db, obj_in=image_instance_create, commit=commit
        )

        for tag_keyword in tag_keywords_for_image_instance:
            tag = tags_by_keyword[tag_keyword]
            tag_value = core.logic.dicom.dicomweb_get_tag_value_from_instance(
                series, tag, allow_empty=True
            )

            image_instance.tags.append(
                models.ImageInstanceTagValue(
                    image_instance_id=image_instance.id, tag_id=tag.id, value=tag_value
                )
            )
        synced_image_instances.append(image_instance)

    return synced_image_instances


def get_all_image_instances_from_task(task: models.Task) -> List[models.ImageInstance]:
    if task.task_type == schemas.TaskType.label_assignment:
        image_instances = task.image_instances
    elif task.task_type == schemas.TaskType.annotation:
        image_instances = [
            label_assignment.image_instance
            for label_assignment in task.label_assignments
        ]
        image_instances = [
            next(group)
            for _, group in groupby(image_instances, key=lambda instance: instance.id)
        ]
    elif task.task_type == schemas.TaskType.annotation_review:
        image_instances = [
            annotation.label_assignment.image_instance
            for annotation in task.annotations
        ]
        image_instances = [
            next(group)
            for _, group in groupby(image_instances, key=lambda instance: instance.id)
        ]
    else:
        raise ValueError("Invalid task type.")

    return image_instances
