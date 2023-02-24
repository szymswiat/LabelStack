from typing import TYPE_CHECKING
import sqlalchemy as sa
from sqlalchemy import Identity
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.db.base_class import Base

if TYPE_CHECKING:
    from app import models


# TODO: add creation time field (in seconds)
class Annotation(Base):
    __tablename__ = "annotation"

    id: Mapped[int] = mapped_column(sa.Integer, Identity(always=True), primary_key=True)

    label_assignment_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("label_assignment.id"), nullable=False
    )

    author_id: Mapped[int] = mapped_column(sa.Integer, sa.ForeignKey("user.id"), nullable=False)
    parent_task_id: Mapped[int] = mapped_column(sa.Integer, sa.ForeignKey("task.id"), nullable=False)

    version: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    spent_time: Mapped[int] = mapped_column(sa.BigInteger, default=0, nullable=False)
    status: Mapped[int] = mapped_column(sa.Integer, nullable=False)

    label_assignment: Mapped["models.LabelAssignment"] = relationship(
        "LabelAssignment", back_populates="annotations"
    )

    reviews: Mapped[list["models.AnnotationReview"]] = relationship(
        "AnnotationReview",
        foreign_keys="AnnotationReview.annotation_id",
        order_by="AnnotationReview.sequence",
    )

    data_list: Mapped[list["models.AnnotationData"]] = relationship(
        "AnnotationData",
        order_by="AnnotationData.sequence",
        cascade="delete, delete-orphan",
    )

    __table_args__ = (sa.UniqueConstraint("label_assignment_id", "version"),)
