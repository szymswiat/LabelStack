import sqlalchemy as sa
from sqlalchemy import Identity

from sqlalchemy.orm import relationship
from app.db.base_class import Base


# TODO: add creation time field (in seconds)
class LabelAssignment(Base):
    __tablename__ = "label_assignment"

    id = sa.Column(sa.Integer, Identity(always=True), primary_key=True)

    label_id = sa.Column(sa.Integer, sa.ForeignKey("label.id"), nullable=False)
    image_instance_id = sa.Column(
        sa.Integer, sa.ForeignKey("image_instance.id"), nullable=False
    )

    author_id = sa.Column(sa.Integer, sa.ForeignKey("user.id"), nullable=False)
    parent_task_id = sa.Column(sa.Integer, sa.ForeignKey("task.id"), nullable=False)

    is_annotated = sa.Column(sa.Boolean, default=False, nullable=False)

    label = relationship("Label")
    image_instance = relationship("ImageInstance", back_populates="label_assignments")
    author = relationship("User")
    parent_task = relationship("Task")

    annotations = relationship("Annotation", order_by="Annotation.version")

    __table_args__ = (sa.UniqueConstraint("label_id", "image_instance_id"),)
