import sqlalchemy as sa
from sqlalchemy import Identity
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base


# TODO: add creation time field (in seconds)
class AnnotationReview(Base):
    __tablename__ = "annotation_review"

    id: Mapped[int] = mapped_column(sa.Integer, Identity(always=True), primary_key=True)

    annotation_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("annotation.id"), nullable=False
    )
    sequence: Mapped[int] = mapped_column(sa.Integer, nullable=False)

    resulting_annotation_id: Mapped[int | None] = mapped_column(
        sa.Integer, sa.ForeignKey("annotation.id"), nullable=True
    )

    author_id: Mapped[int] = mapped_column(sa.Integer, sa.ForeignKey("user.id"), nullable=False)
    parent_task_id: Mapped[int] = mapped_column(sa.Integer, sa.ForeignKey("task.id"), nullable=False)
    status: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    result: Mapped[str | None] = mapped_column(sa.String, nullable=True)
    comment: Mapped[str | None] = mapped_column(sa.String, nullable=True)

    __table_args__ = (sa.UniqueConstraint("annotation_id", "sequence"),)
