from typing import TYPE_CHECKING
import sqlalchemy as sa
from sqlalchemy import Identity
from sqlalchemy.orm import relationship, mapped_column, Mapped
from app.db.base_class import Base

if TYPE_CHECKING:
    from app import models


# TODO: add creation time field (in seconds)
# TODO: add field is_useless
class Dicom(Base):
    __tablename__ = "dicom"

    id: Mapped[int] = mapped_column(sa.Integer, Identity(always=True), primary_key=True)

    patient_id: Mapped[str] = mapped_column(sa.String, nullable=False)
    study_id: Mapped[str] = mapped_column(sa.String, nullable=False)
    series_id: Mapped[str] = mapped_column(sa.String, nullable=False)
    instance_id: Mapped[str] = mapped_column(sa.String, nullable=False)

    tags: Mapped[list["models.DicomTagValue"]] = relationship("DicomTagValue")
