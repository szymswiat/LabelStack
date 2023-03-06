import sqlalchemy as sa
from sqlalchemy import Identity, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base


# TODO: add creation time field (in seconds)
class Annotation(Base):
    __tablename__ = "annotation"

    id = sa.Column(sa.Integer, Identity(always=True), primary_key=True)

    label_assignment_id = sa.Column(
        sa.Integer, sa.ForeignKey("label_assignment.id"), nullable=False
    )

    author_id = sa.Column(sa.Integer, sa.ForeignKey("user.id"), nullable=False)
    parent_task_id = sa.Column(sa.Integer, sa.ForeignKey("task.id"), nullable=False)

    version = sa.Column(sa.Integer, nullable=False)
    spent_time = sa.Column(sa.BigInteger, default=0, nullable=False)
    status = sa.Column(sa.Integer, nullable=False)

    label_assignment = relationship("LabelAssignment", back_populates="annotations")

    reviews = relationship(
        "AnnotationReview",
        foreign_keys="AnnotationReview.annotation_id",
        order_by="AnnotationReview.sequence",
    )
    data_list = relationship(
        "AnnotationData",
        order_by="AnnotationData.sequence",
        cascade="delete, delete-orphan",
    )

    __table_args__ = (sa.UniqueConstraint("label_assignment_id", "version"),)
