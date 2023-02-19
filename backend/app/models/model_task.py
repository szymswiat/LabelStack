from typing import TYPE_CHECKING
import sqlalchemy as sa
from sqlalchemy import Identity
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.db.base_class import Base
from app.models.model_associations import (
    TaskImageInstance,
    TaskLabelAssignment,
    TaskAnnotation,
)

if TYPE_CHECKING:
    from app import models


# TODO: add creation time field (in seconds)
class Task(Base):
    __tablename__ = "task"

    id: Mapped[int] = mapped_column(sa.Integer, Identity(always=True), primary_key=True)

    assigned_user_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("user.id"), nullable=True
    )
    submitter_user_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("user.id"), nullable=False
    )

    task_type: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    name: Mapped[str] = mapped_column(sa.String, nullable=False)
    description: Mapped[str] = mapped_column(sa.String, nullable=True)
    priority: Mapped[int] = mapped_column(sa.Integer, nullable=False, default=0)
    status: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    total_time: Mapped[int] = mapped_column(sa.BigInteger, nullable=False, default=0)

    image_instances: Mapped[list["models.ImageInstance"]] = relationship(
        "ImageInstance", secondary=TaskImageInstance.__table__
    )
    label_assignments: Mapped[list["models.LabelAssignment"]] = relationship(
        "LabelAssignment", secondary=TaskLabelAssignment.__table__
    )
    annotations: Mapped[list["models.Annotation"]] = relationship(
        "Annotation", secondary=TaskAnnotation.__table__
    )
