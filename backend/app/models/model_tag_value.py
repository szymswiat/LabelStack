import sqlalchemy as sa
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class DicomTagValue(Base):
    __tablename__ = "dicom_tag_value"

    dicom_id = sa.Column(sa.Integer, sa.ForeignKey("dicom.id"), primary_key=True)
    tag_id = sa.Column(sa.Integer, sa.ForeignKey("tag.id"), primary_key=True)

    value = sa.Column(sa.String, nullable=False)

    tag = relationship("Tag")


class ImageInstanceTagValue(Base):
    __tablename__ = "image_instance_tag_value"

    image_instance_id = sa.Column(
        sa.Integer, sa.ForeignKey("image_instance.id"), primary_key=True
    )
    tag_id = sa.Column(sa.Integer, sa.ForeignKey("tag.id"), primary_key=True)

    value = sa.Column(sa.String, nullable=False)

    tag = relationship("Tag")
