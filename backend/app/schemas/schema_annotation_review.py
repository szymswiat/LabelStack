from enum import IntEnum, Enum
from typing import Optional

from pydantic import BaseModel


class AnnotationReviewStatus(IntEnum):
    open = 0
    done = 1


class AnnotationReviewResult(str, Enum):
    accepted = "accepted"
    denied = "denied"
    denied_corrected = "denied_corrected"


class AnnotationReviewCreateApiIn(BaseModel):
    annotation_id: int
    author_id: int
    parent_task_id: int


class AnnotationReviewCreateCrud(AnnotationReviewCreateApiIn):
    sequence: int
    status: AnnotationReviewStatus


class AnnotationReviewUpdateApiIn(BaseModel):
    result: AnnotationReviewResult
    comment: Optional[str] = None


class AnnotationReviewUpdateCrud(AnnotationReviewUpdateApiIn):
    status: Optional[AnnotationReviewStatus] = None


class AnnotationReview(BaseModel):
    id: int

    annotation_id: int
    sequence: int

    resulting_annotation_id: Optional[int] = None

    author_id: int
    parent_task_id: int
    status: AnnotationReviewStatus
    result: Optional[AnnotationReviewResult] = None
    comment: Optional[str] = None

    class Config:
        orm_mode = True


class AnnotationReviewApiOut(AnnotationReview):
    pass
