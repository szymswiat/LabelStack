from itertools import groupby
from typing import Dict, List

from sqlalchemy.orm import Session

from app import models, query, schemas, crud, core, utils
from app.resources.modalities import IMAGING_MODALITIES
from app.utils import DicomWebQidoInstance, DicomTags
from app import resources


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


def sync_pacs_with_image_instances(
    db: Session,
    series_list: List[DicomWebQidoInstance],
    instances: List[DicomWebQidoInstance],
    tags: DicomTags,
    *,
    commit: bool = False,
) -> List[models.ImageInstance]:
    tag_keywords_for_image_instance = [
        "PatientID",
        "Modality",
        "BodyPartExamined",
    ]

    grouped_instances = group_instances_by_series(instances)

    synced_image_instances: List[models.ImageInstance] = []

    for series in series_list:
        id_ref = series.get_tag_by_keyword("SeriesInstanceUID")
        modality = series.get_tag_by_keyword("Modality")

        image_instance = query.image_instance.query_by_id_ref(db, id_ref=id_ref).first()

        bound_dicom_instances = grouped_instances[id_ref]

        if (
            image_instance is not None
            or modality not in IMAGING_MODALITIES
            or not check_support_for_series(bound_dicom_instances)
        ):
            print(f"dropping {id_ref}")
            # TODO: what about updates?
            continue

        image_instance_create = schemas.ImageInstanceCreateCrud(id_ref=id_ref)
        image_instance = crud.image_instance.create(
            db, obj_in=image_instance_create, commit=commit
        )

        for tag_keyword in tag_keywords_for_image_instance:
            tag = tags.get_by_keyword(tag_keyword)
            tag_value = series.get_tag_value(tag, allow_empty=True)

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


def group_instances_by_series(
    instances: List[DicomWebQidoInstance],
) -> Dict[str, List[DicomWebQidoInstance]]:

    instances_by_series = [
        (instance.get_tag_by_keyword("SeriesInstanceUID"), instance)
        for instance in instances
    ]

    return utils.build_grouped_dict(instances_by_series)


def check_support_for_series(
    bound_instances: List[DicomWebQidoInstance],
) -> bool:

    for instance in bound_instances:
        sop_class = instance.get_tag_by_keyword("SOPClassUID")
        scan_options = (
            instance.get_tag_by_keyword("ScanOptions")
            if instance.has_tag_by_keyword("ScanOptions")
            else ""
        )

        if (
            sop_class not in resources.IMAGING_SOP_CLASSES
            or scan_options in resources.UNSUPPORTED_SCAN_OPTIONS
        ):
            return False

    return True
