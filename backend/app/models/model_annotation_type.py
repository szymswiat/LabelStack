import sqlalchemy as sa
from sqlalchemy import Identity
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base


class AnnotationType(Base):
    __tablename__ = "annotation_type"

    id: Mapped[int] = mapped_column(sa.Integer, Identity(always=True), primary_key=True)

    name: Mapped[str] = mapped_column(sa.String, nullable=False)
