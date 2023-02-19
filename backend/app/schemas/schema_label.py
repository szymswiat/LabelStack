from pydantic import BaseModel

from app.schemas.schema_annotation_type import AnnotationTypeApiOut, AnnotationType
from app.schemas.schema_label_type import LabelTypeApiOut, LabelType


class LabelCreateApiIn(BaseModel):
    name: str

    allowed_annotation_type_id: int | None = None
    type_ids: list[int] = []


class LabelCreateCrud(LabelCreateApiIn):
    pass


class LabelUpdateApiIn(BaseModel):
    name: str
    type_ids: list[int]


class LabelUpdateCrud(LabelUpdateApiIn):
    pass


class Label(BaseModel):
    id: int
    name: str

    allowed_annotation_type: AnnotationType | None = None
    types: list[LabelType]

    class Config:
        orm_mode = True


class LabelApiOut(Label):
    allowed_annotation_type: AnnotationTypeApiOut | None = None
    types: list[LabelTypeApiOut]
