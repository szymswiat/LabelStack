import sqlalchemy as sa
from sqlalchemy import Identity

from app.db.base_class import Base


class AnnotationType(Base):
    __tablename__ = "annotation_type"

    id = sa.Column(sa.Integer, Identity(always=True), primary_key=True)

    name = sa.Column(sa.String, nullable=False)
