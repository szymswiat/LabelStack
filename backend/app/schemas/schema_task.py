from __future__ import annotations

from enum import IntEnum
from typing import List, Optional

from pydantic import BaseModel

from app.schemas.schema_annotation import AnnotationApiOut, Annotation
from app.schemas.schema_annotation_type import AnnotationTypeApiOut, AnnotationType
from app.schemas.schema_image_instance import ImageInstance, ImageInstanceApiOut
from app.schemas.schema_label_assignment import LabelAssignment, LabelAssignmentApiOut


class TaskType(IntEnum):
    label_assignment = 0
    annotation = 1
    annotation_review = 2


class TaskStatus(IntEnum):
    unassigned = 0
    open = 1
    in_progress = 2
    done = 3
    cancelled = 4

    @staticmethod
    def active_statuses() -> List[TaskStatus]:
        return [TaskStatus.unassigned, TaskStatus.open, TaskStatus.in_progress]

    @staticmethod
    def inactive_statuses() -> List[TaskStatus]:
        return [TaskStatus.done, TaskStatus.cancelled]


class TaskCreateApiIn(BaseModel):
    assigned_user_id: Optional[int] = None
    task_type: TaskType
    name: str
    description: Optional[str] = None
    priority: Optional[int] = None

    image_instance_ids: Optional[List[int]] = []
    label_assignment_ids: Optional[List[int]] = []
    annotation_ids: Optional[List[int]] = []


class TaskCreateCrud(TaskCreateApiIn):
    status: TaskStatus
    submitter_user_id: int
    total_time: int


class TaskUpdateApiIn(BaseModel):
    assigned_user_id: Optional[int] = None


class TaskUpdateCrud(TaskUpdateApiIn):
    status: Optional[TaskStatus] = None
    total_time: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[int] = None


class Task(BaseModel):
    id: int

    assigned_user_id: Optional[int] = None
    submitter_user_id: int

    task_type: TaskType
    name: str
    description: Optional[str] = None
    priority: int
    status: TaskStatus
    total_time: int

    target_annotation_type: Optional[AnnotationType] = None

    image_instances: List[ImageInstance]
    label_assignments: List[LabelAssignment]
    annotations: List[Annotation]

    class Config:
        orm_mode = True


class TaskApiOut(Task):
    target_annotation_type: Optional[AnnotationTypeApiOut] = None

    image_instances: List[ImageInstanceApiOut]
    label_assignments: List[LabelAssignmentApiOut]
    annotations: List[AnnotationApiOut]


class AvailableStatusesForTaskApiOut(BaseModel):
    statuses: List[int]
