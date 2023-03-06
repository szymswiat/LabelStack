import sqlalchemy as sa
from sqlalchemy import Identity
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class ImageInstance(Base):
    __tablename__ = "image_instance"

    id = sa.Column(sa.Integer, Identity(always=True), primary_key=True)
    id_ref = sa.Column(sa.String, nullable=False, unique=True)

    is_labeled = sa.Column(sa.Boolean, nullable=False, default=False)

    label_assignments = relationship(
        "LabelAssignment",
        back_populates="image_instance",
        cascade="delete, delete-orphan",
    )

    tags = relationship("ImageInstanceTagValue")
