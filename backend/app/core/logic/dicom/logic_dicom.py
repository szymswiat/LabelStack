from copy import deepcopy

from sqlalchemy.orm import Session

from app import models, query, schemas, crud
from app.utils.dicomweb import DicomTags, DicomWebQidoInstance


def sync_pacs_with_dicoms(
    db: Session,
    instances: list[DicomWebQidoInstance],
    tags: DicomTags,
    *,
    commit: bool = False,
) -> list[models.Dicom]:
    synced_dicoms: list[models.Dicom] = []

    instances = deepcopy(instances)

    for instance in instances:

        patient_id = instance.get_tag_by_keyword("PatientID", pop=True, allow_empty=True)
        study_id = instance.get_tag_by_keyword("StudyInstanceUID", pop=True)
        series_id = instance.get_tag_by_keyword("SeriesInstanceUID", pop=True)
        instance_id = instance.get_tag_by_keyword("SOPInstanceUID", pop=True)

        instance.remove_tag(tags.get_by_keyword("RetrieveURL"))

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

        for tag_ge, tag_value in instance.data.items():
            tag = tags.get_by_group_element(tag_ge)
            if "Value" not in tag_value:
                continue

            if type(tag_value["Value"][0]) is not str:
                continue

            dicom.tags.append(
                models.DicomTagValue(dicom_id=dicom.id, tag_id=tag.id, value=tag_value["Value"][0])
            )
        synced_dicoms.append(dicom)

    return synced_dicoms
