from itertools import groupby

from sqlalchemy.orm import Session

from app import models, query, schemas, crud, utils
from app.core import logic
from app.resources.modalities import IMAGING_MODALITIES
from app.utils import DicomWebQidoInstance, DicomTags
from app import resources


def has_labels(image_instance: models.ImageInstance, labels: list[models.Label]) -> bool:
    image_label_ids = [la.label_id for la in image_instance.label_assignments]
    for label in labels:
        if label.id not in image_label_ids:
            return False
    return True


def clear_labels(image_instance: models.ImageInstance, label_ids: list[int]):
    label_assignments_to_remove = [
        la for la in image_instance.label_assignments if la.label_id in label_ids
    ]
    for label_assignment in label_assignments_to_remove:
        image_instance.label_assignments.remove(label_assignment)


def sync_pacs_with_image_instances(
    db: Session,
    series_list: list[DicomWebQidoInstance],
    instances: list[DicomWebQidoInstance],
    tags: DicomTags,
    *,
    commit: bool = False,
) -> list[models.ImageInstance]:
    tag_keywords_for_image_instance = [
        "PatientID",
        "Modality",
        "BodyPartExamined",
    ]

    grouped_instances = group_instances_by_series(instances)

    synced_image_instances: list[models.ImageInstance] = []

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
            # TODO: what about updates?
            continue

        image_instance_create = schemas.ImageInstanceCreateCrud(id_ref=id_ref)
        image_instance = crud.image_instance.create(db, obj_in=image_instance_create, commit=commit)

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


def get_all_image_instances_for_task(task: models.Task) -> list[models.ImageInstance]:
    if task.task_type in [schemas.TaskType.label_assignment, schemas.TaskType.annotation]:
        image_instances = task.image_instances
    elif task.task_type == schemas.TaskType.annotation_review:
        image_instances = [
            annotation.label_assignment.image_instance for annotation in task.annotations
        ]
        image_instances = [
            next(group) for _, group in groupby(image_instances, key=lambda instance: instance.id)
        ]
    else:
        raise ValueError("Invalid task type.")

    return image_instances


def filter_image_instances_for_user(
    image_instance_list: list[models.ImageInstance],
    user: models.User,
) -> list[schemas.ImageInstance]:

    image_instance_list_new: list[schemas.ImageInstance] = []

    for image_instance in image_instance_list:
        image_instance_new = schemas.ImageInstance.from_orm(image_instance)

        if not logic.user.has_role_one_of(
            user, [schemas.RoleType.superuser, schemas.RoleType.task_admin]
        ):
            image_instance_new.label_assignments = filter_label_assignments_for_user(
                image_instance.label_assignments, user
            )

        image_instance_list_new.append(image_instance_new)

    return image_instance_list_new


def filter_label_assignments_for_user(
    label_assignment_list: list[models.LabelAssignment],
    user: models.User,
) -> list[schemas.LabelAssignment]:

    label_assignment_list_new: list[schemas.LabelAssignment] = []

    for label_assignment in label_assignment_list:

        if (
            label_assignment.parent_task is not None
            and label_assignment.parent_task.status != schemas.TaskStatus.done
            and label_assignment.author_id != user.id
        ):
            continue

        label_assignment_new = schemas.LabelAssignment.from_orm(label_assignment)
        label_assignment_new.annotations = filter_annotations_for_user(
            label_assignment.annotations, user
        )

        label_assignment_list_new.append(label_assignment_new)

    return label_assignment_list_new


def filter_annotations_for_user(
    annotation_list: list[models.Annotation],
    user: models.User,
) -> list[schemas.Annotation]:

    annotation_list_new: list[schemas.Annotation] = []

    for annotation in annotation_list:

        if annotation.parent_task.status != schemas.TaskStatus.done and annotation.author_id != user.id:
            continue

        annotation_new = schemas.Annotation.from_orm(annotation)
        annotation_list_new.append(annotation_new)

        pass

    return annotation_list_new


def group_instances_by_series(
    instances: list[DicomWebQidoInstance],
) -> dict[str, list[DicomWebQidoInstance]]:

    instances_by_series = [
        (instance.get_tag_by_keyword("SeriesInstanceUID"), instance) for instance in instances
    ]

    return utils.build_grouped_dict(instances_by_series)


def check_support_for_series(
    bound_instances: list[DicomWebQidoInstance],
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
