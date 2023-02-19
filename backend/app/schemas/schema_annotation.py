from enum import IntEnum

from pydantic import BaseModel

from app.schemas.schema_annotation_review import (
    AnnotationReviewApiOut,
    AnnotationReview,
)
from app.schemas.schema_annotation_data import AnnotationDataApiOut, AnnotationData


class AnnotationStatus(IntEnum):
    open = 0
    done = 1


class AnnotationCreateApiIn(BaseModel):
    label_assignment_id: int
    parent_task_id: int


class AnnotationCreateCrud(AnnotationCreateApiIn):
    author_id: int

    version: int
    status: AnnotationStatus

    spent_time: int


class AnnotationUpdateApiIn(BaseModel):
    spent_time: int | None = None


class AnnotationUpdateCrud(BaseModel):
    status: AnnotationStatus | None = None
    spent_time: int | None = None


class Annotation(BaseModel):
    id: int

    label_assignment_id: int

    author_id: int
    parent_task_id: int

    version: int
    spent_time: int
    status: AnnotationStatus

    reviews: list[AnnotationReview]
    data_list: list[AnnotationData]

    class Config:
        orm_mode = True


class AnnotationApiOut(Annotation):
    reviews: list[AnnotationReviewApiOut]
    data_list: list[AnnotationDataApiOut]
