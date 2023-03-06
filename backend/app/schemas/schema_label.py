from typing import List, Optional
from pydantic import BaseModel

from app.schemas.schema_annotation_type import AnnotationTypeApiOut, AnnotationType
from app.schemas.schema_label_type import LabelTypeApiOut, LabelType


class LabelCreateApiIn(BaseModel):
    name: str

    allowed_annotation_type_id: Optional[int] = None
    type_ids: List[int] = []


class LabelCreateCrud(LabelCreateApiIn):
    pass


class LabelUpdateApiIn(BaseModel):
    name: str
    type_ids: List[int]


class LabelUpdateCrud(LabelUpdateApiIn):
    pass


class Label(BaseModel):
    id: int
    name: str

    allowed_annotation_type: Optional[AnnotationType] = None
    types: List[LabelType]

    class Config:
        orm_mode = True


class LabelApiOut(Label):
    allowed_annotation_type: Optional[AnnotationTypeApiOut] = None
    types: List[LabelTypeApiOut]
