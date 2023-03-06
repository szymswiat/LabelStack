from pydantic import BaseModel

from app.schemas.schema_tag import TagApiOut, Tag


class DicomTagValue(BaseModel):
    tag: Tag
    value: str

    class Config:
        orm_mode = True


class DicomTagValueApiOut(DicomTagValue):
    tag: TagApiOut


class ImageInstanceTagValue(BaseModel):
    tag: Tag
    value: str

    class Config:
        orm_mode = True


class ImageInstanceTagValueApiOut(ImageInstanceTagValue):
    tag: TagApiOut
