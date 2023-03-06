from typing import List

from app.schemas.schema_label_assignment import LabelAssignment
from app.schemas.schema_tag_value import *


class ImageInstanceCreateCrud(BaseModel):
    id_ref: str


class ImageInstanceUpdateApiIn(BaseModel):
    pass


class ImageInstanceUpdateCrud(ImageInstanceUpdateApiIn):
    pass


class ImageInstance(BaseModel):
    id: int
    id_ref: str

    is_labeled: bool
    label_assignments: List[LabelAssignment]

    tags: List[ImageInstanceTagValue]

    class Config:
        orm_mode = True


class ImageInstanceApiOut(ImageInstance):
    tags: List[ImageInstanceTagValueApiOut]
