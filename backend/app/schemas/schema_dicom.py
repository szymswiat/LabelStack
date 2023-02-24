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


class DicomBase(BaseModel):
    id: int
    patient_id: str
    study_id: str
    series_id: str
    instance_id: str

    class Config:
        orm_mode = True


class Dicom(DicomBase):
    tags: list[DicomTagValue]


class DicomApiOut(DicomBase):
    tags: list[DicomTagValueApiOut]
