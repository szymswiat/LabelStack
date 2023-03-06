import sqlalchemy as sa
from sqlalchemy import Identity
from sqlalchemy.orm import relationship
from app.db.base_class import Base


# TODO: add creation time field (in seconds)
# TODO: add field is_useless
class Dicom(Base):
    __tablename__ = "dicom"

    id = sa.Column(sa.Integer, Identity(always=True), primary_key=True)

    patient_id = sa.Column(sa.String, nullable=False)
    study_id = sa.Column(sa.String, nullable=False)
    series_id = sa.Column(sa.String, nullable=False)
    instance_id = sa.Column(sa.String, nullable=False)

    tags = relationship("DicomTagValue")
