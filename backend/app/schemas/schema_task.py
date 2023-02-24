from __future__ import annotations

from enum import IntEnum

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
    def active_statuses() -> list[TaskStatus]:
        return [TaskStatus.unassigned, TaskStatus.open, TaskStatus.in_progress]

    @staticmethod
    def inactive_statuses() -> list[TaskStatus]:
        return [TaskStatus.done, TaskStatus.cancelled]


class TaskCreateApiIn(BaseModel):
    assigned_user_id: int | None = None
    task_type: TaskType
    name: str
    description: str | None = None
    priority: int | None = None

    image_instance_ids: list[int] | None = []
    label_assignment_ids: list[int] | None = []
    annotation_ids: list[int] | None = []


class TaskCreateCrud(TaskCreateApiIn):
    status: TaskStatus
    submitter_user_id: int
    total_time: int


class TaskUpdateApiIn(BaseModel):
    assigned_user_id: int | None = None


class TaskUpdateCrud(TaskUpdateApiIn):
    status: TaskStatus | None = None
    total_time: int | None = None
    name: str | None = None
    description: str | None = None
    priority: int | None = None


class TaskBase(BaseModel):
    id: int

    assigned_user_id: int | None = None
    submitter_user_id: int

    task_type: TaskType
    name: str
    description: str | None = None
    priority: int
    status: TaskStatus
    total_time: int

    target_annotation_type: AnnotationType | None = None

    image_instance_ids: list[int] | None
    label_assignment_ids: list[int] | None
    annotation_ids: list[int] | None

    class Config:
        orm_mode = True


class Task(TaskBase):
    image_instances: list[ImageInstance] | None
    label_assignments: list[LabelAssignment] | None
    annotations: list[Annotation] | None


class TaskApiOut(TaskBase):
    target_annotation_type: AnnotationTypeApiOut | None = None

    image_instances: list[ImageInstanceApiOut] | None
    label_assignments: list[LabelAssignmentApiOut] | None
    annotations: list[AnnotationApiOut] | None


class AvailableStatusesForTaskApiOut(BaseModel):
    statuses: list[int]
