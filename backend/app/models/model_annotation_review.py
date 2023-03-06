import sqlalchemy as sa
from sqlalchemy import Identity

from app.db.base_class import Base


# TODO: add creation time field (in seconds)
class AnnotationReview(Base):
    __tablename__ = "annotation_review"

    id = sa.Column(sa.Integer, Identity(always=True), primary_key=True)

    annotation_id = sa.Column(
        sa.Integer, sa.ForeignKey("annotation.id"), nullable=False
    )
    sequence = sa.Column(sa.Integer, nullable=False)

    resulting_annotation_id = sa.Column(
        sa.Integer, sa.ForeignKey("annotation.id"), nullable=True
    )

    author_id = sa.Column(sa.Integer, sa.ForeignKey("user.id"), nullable=False)
    parent_task_id = sa.Column(sa.Integer, sa.ForeignKey("task.id"), nullable=False)
    status = sa.Column(sa.Integer, nullable=False)
    result = sa.Column(sa.String, nullable=True)
    comment = sa.Column(sa.String, nullable=True)

    __table_args__ = (sa.UniqueConstraint("annotation_id", "sequence"),)
