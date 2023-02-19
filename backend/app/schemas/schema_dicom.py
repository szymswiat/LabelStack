from pydantic import BaseModel

from app.schemas.schema_tag_value import DicomTagValue, DicomTagValueApiOut


class DicomCreateCrud(BaseModel):
    patient_id: str
    study_id: str
    series_id: str
    instance_id: str

    pass


class DicomUpdateApiIn(BaseModel):
    # TODO: add tags
    pass


class DicomUpdateCrud(DicomUpdateApiIn):
    pass


class Dicom(BaseModel):
    id: int
    patient_id: str
    study_id: str
    series_id: str
    instance_id: str

    tags: list[DicomTagValue]

    class Config:
        orm_mode = True


class DicomApiOut(Dicom):
    tags: list[DicomTagValueApiOut]
