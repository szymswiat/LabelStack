from pydantic import BaseModel

from app.schemas.schema_annotation import Annotation, AnnotationApiOut


class LabelAssignmentsModifyApiIn(BaseModel):
    label_ids_to_create: list[int]
    label_ids_to_remove: list[int]
    image_instance_id: int

    parent_task_id: int | None = None


class LabelAssignmentsAddApiIn(BaseModel):
    image_instance_ids: list[int]
    label_to_add_id: int


class LabelAssignmentCreateCrud(BaseModel):
    label_id: int
    image_instance_id: int

    parent_task_id: int | None = None
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
    parent_task_id: int | None = None

    annotations: list[Annotation]

    class Config:
        orm_mode = True


class LabelAssignmentApiOut(BaseModel):
    id: int

    label_id: int
    image_instance_id: int

    author_id: int
    parent_task_id: int | None = None

    annotations: list[AnnotationApiOut]

    class Config:
        orm_mode = True
