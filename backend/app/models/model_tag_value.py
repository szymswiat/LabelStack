import sqlalchemy as sa
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.db.base_class import Base

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app import models


class DicomTagValue(Base):
    __tablename__ = "dicom_tag_value"

    dicom_id: Mapped[int] = mapped_column(sa.Integer, sa.ForeignKey("dicom.id"), primary_key=True)
    tag_id: Mapped[int] = mapped_column(sa.Integer, sa.ForeignKey("tag.id"), primary_key=True)

    value: Mapped[str] = mapped_column(sa.String, nullable=False)

    tag: Mapped["models.Tag"] = relationship("Tag")


class ImageInstanceTagValue(Base):
    __tablename__ = "image_instance_tag_value"

    image_instance_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("image_instance.id"), primary_key=True
    )
    tag_id: Mapped[int] = mapped_column(sa.Integer, sa.ForeignKey("tag.id"), primary_key=True)

    value: Mapped[str] = mapped_column(sa.String, nullable=False)

    tag: Mapped["models.Tag"] = relationship("Tag")
