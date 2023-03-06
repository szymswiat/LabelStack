import sqlalchemy as sa
from sqlalchemy import Identity
from sqlalchemy.orm import relationship

from app.db.base_class import Base
from app.models.model_associations import LabelLabelType


class Label(Base):
    __tablename__ = "label"

    id = sa.Column(sa.Integer, Identity(always=True), primary_key=True)

    name = sa.Column(sa.String, nullable=False)
    allowed_annotation_type_id = sa.Column(
        sa.Integer, sa.ForeignKey("annotation_type.id"), nullable=True
    )

    allowed_annotation_type = relationship("AnnotationType")
    types = relationship("LabelType", secondary=LabelLabelType.__table__)
