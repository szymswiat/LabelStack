from typing import List
from pydantic import BaseModel

from app.schemas.schema_annotation import Annotation, AnnotationApiOut


class LabelAssignmentsModifyApiIn(BaseModel):
    label_ids_to_create: List[int]
    label_ids_to_remove: List[int]
    image_instance_id: int

    parent_task_id: int


class LabelAssignmentCreateCrud(BaseModel):
    label_id: int
    image_instance_id: int

    parent_task_id: int
    author_id: int


class LabelAssignmentUpdateApiIn(BaseModel):
    pass


class LabelAssignmentUpdateCrud(LabelAssignmentUpdateApiIn):
    is_annotated: bool


class LabelAssignment(BaseModel):
    id: int

    label_id: int
    image_instance_id: int

    author_id: int
    parent_task_id: int

    annotations: List[Annotation]

    class Config:
        orm_mode = True


class LabelAssignmentApiOut(BaseModel):
    id: int

    label_id: int
    image_instance_id: int

    author_id: int
    parent_task_id: int

    annotations: List[AnnotationApiOut]

    class Config:
        orm_mode = True
