from typing import TYPE_CHECKING
import sqlalchemy as sa
from sqlalchemy import Identity

from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.db.base_class import Base


if TYPE_CHECKING:
    from app import models


# TODO: add creation time field (in seconds)
class LabelAssignment(Base):
    __tablename__ = "label_assignment"

    id: Mapped[int] = mapped_column(sa.Integer, Identity(always=True), primary_key=True)

    label_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("label.id"), nullable=False
    )
    image_instance_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("image_instance.id"), nullable=False
    )

    author_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("user.id"), nullable=False
    )
    parent_task_id: Mapped[int | None] = mapped_column(
        sa.Integer, sa.ForeignKey("task.id"), nullable=True
    )

    is_annotated: Mapped[bool] = mapped_column(
        sa.Boolean, default=False, nullable=False
    )

    label: Mapped["models.Label"] = relationship("Label")
    image_instance: Mapped["models.ImageInstance"] = relationship(
        "ImageInstance", back_populates="label_assignments"
    )
    author: Mapped["models.User"] = relationship("User")
    parent_task: Mapped["models.Task"] = relationship("Task")

    annotations: Mapped[list["models.Annotation"]] = relationship(
        "Annotation", order_by="Annotation.version"
    )

    __table_args__ = (sa.UniqueConstraint("label_id", "image_instance_id"),)
