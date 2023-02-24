from pydantic import BaseModel

from app.schemas.schema_label_assignment import LabelAssignment, LabelAssignmentApiOut
from app.schemas.schema_tag_value import (
    ImageInstanceTagValue,
    ImageInstanceTagValueApiOut,
)


class ImageInstanceCreateCrud(BaseModel):
    id_ref: str


class ImageInstanceUpdateApiIn(BaseModel):
    pass


class ImageInstanceUpdateCrud(ImageInstanceUpdateApiIn):
    pass


class ImageInstanceBase(BaseModel):
    id: int
    id_ref: str

    visited: bool

    class Config:
        orm_mode = True


class ImageInstance(ImageInstanceBase):
    label_assignments: list[LabelAssignment]
    tags: list[ImageInstanceTagValue]


class ImageInstanceApiOut(ImageInstanceBase):
    label_assignments: list[LabelAssignmentApiOut]
    tags: list[ImageInstanceTagValueApiOut]
