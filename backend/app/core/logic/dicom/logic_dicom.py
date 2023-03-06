from typing import List, Dict, Optional

from sqlalchemy.orm import Session

from app import models, query, schemas, crud


def sync_instances_with_dicoms(
    db: Session,
    instances: List[Dict[str, Dict]],
    tags_by_keyword: Dict[str, models.Tag],
    tags_by_ge: Dict[str, models.Tag],
    commit=False,
) -> List[models.Dicom]:
    synced_dicoms: List[models.Dicom] = []

    for instance in instances:
        patient_id = dicomweb_get_tag_value_from_instance(
            instance, tags_by_keyword["PatientID"], pop=True, allow_empty=True
        )
        study_id = dicomweb_get_tag_value_from_instance(
            instance, tags_by_keyword["StudyInstanceUID"], pop=True
        )
        series_id = dicomweb_get_tag_value_from_instance(
            instance, tags_by_keyword["SeriesInstanceUID"], pop=True
        )
        instance_id = dicomweb_get_tag_value_from_instance(
            instance, tags_by_keyword["SOPInstanceUID"], pop=True
        )

        instance.pop(tags_by_keyword["RetrieveURL"].group_element_id)

        dicom = query.dicom.query_by_instance_id(db, instance_id=instance_id).first()
        if dicom is not None:
            continue
        dicom_create = schemas.DicomCreateCrud(
            patient_id=patient_id,
            study_id=study_id,
            series_id=series_id,
            instance_id=instance_id,
        )
        dicom = crud.dicom.create(db, obj_in=dicom_create, commit=commit)

        for tag_ge, tag_value in instance.items():
            tag = tags_by_ge[tag_ge]
            if "Value" not in tag_value:
                continue

            if type(tag_value["Value"][0]) is not str:
                continue

            dicom.tags.append(
                models.DicomTagValue(
                    dicom_id=dicom.id, tag_id=tag.id, value=tag_value["Value"][0]
                )
            )
        synced_dicoms.append(dicom)

    return synced_dicoms


def dicomweb_get_tag_value_from_instance(
    instance: Dict[str, Dict],
    tag: models.Tag,
    *,
    pop: bool = False,
    allow_empty: bool = False
) -> str:
    if tag.group_element_id not in instance:
        if allow_empty is False:
            raise ValueError("Missing tag value.")
        else:
            return ""

    if pop:
        dicomweb_tag_item = instance.pop(tag.group_element_id)
    else:
        dicomweb_tag_item = instance[tag.group_element_id]

    if "Value" in dicomweb_tag_item:
        tag_value = dicomweb_tag_item["Value"][0]
    else:
        if allow_empty is False:
            raise ValueError("Missing tag value.")
        tag_value = ""

    return tag_value
