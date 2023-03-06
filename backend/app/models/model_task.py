import sqlalchemy as sa
from sqlalchemy import Identity
from sqlalchemy.orm import relationship

from app.db.base_class import Base
from app.models.model_associations import (
    TaskImageInstance,
    TaskLabelAssignment,
    TaskAnnotation,
)


# TODO: add creation time field (in seconds)
class Task(Base):
    __tablename__ = "task"

    id = sa.Column(sa.Integer, Identity(always=True), primary_key=True)

    assigned_user_id = sa.Column(sa.Integer, sa.ForeignKey("user.id"), nullable=True)
    submitter_user_id = sa.Column(sa.Integer, sa.ForeignKey("user.id"), nullable=False)

    task_type = sa.Column(sa.Integer, nullable=False)
    name = sa.Column(sa.String, nullable=False)
    description = sa.Column(sa.String, nullable=True)
    priority = sa.Column(sa.Integer, nullable=False, default=0)
    status = sa.Column(sa.Integer, nullable=False)
    total_time = sa.Column(sa.BigInteger, nullable=False, default=0)

    image_instances = relationship(
        "ImageInstance", secondary=TaskImageInstance.__table__
    )
    label_assignments = relationship(
        "LabelAssignment", secondary=TaskLabelAssignment.__table__
    )
    annotations = relationship("Annotation", secondary=TaskAnnotation.__table__)
