from enum import IntEnum
from typing import List, Optional

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
    spent_time: Optional[int] = None


class AnnotationUpdateCrud(BaseModel):
    status: Optional[AnnotationStatus] = None
    spent_time: Optional[int] = None


class Annotation(BaseModel):
    id: int

    label_assignment_id: int

    author_id: int
    parent_task_id: int

    version: int
    spent_time: int
    status: AnnotationStatus

    reviews: List[AnnotationReview]
    data_list: List[AnnotationData]

    class Config:
        orm_mode = True


class AnnotationApiOut(Annotation):
    reviews: List[AnnotationReviewApiOut]
    data_list: List[AnnotationDataApiOut]
