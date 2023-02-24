from typing import TYPE_CHECKING
import sqlalchemy as sa
from sqlalchemy import Identity
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.db.base_class import Base
from app.models.model_associations import LabelLabelType


if TYPE_CHECKING:
    from app import models


class Label(Base):
    __tablename__ = "label"

    id: Mapped[int] = mapped_column(sa.Integer, Identity(always=True), primary_key=True)

    name: Mapped[str] = mapped_column(sa.String, nullable=False)
    allowed_annotation_type_id: Mapped[int | None] = mapped_column(
        sa.Integer, sa.ForeignKey("annotation_type.id"), nullable=True
    )

    allowed_annotation_type: Mapped["models.AnnotationType"] = relationship(
        "AnnotationType"
    )
    types: Mapped[list["models.LabelType"]] = relationship(
        "LabelType", secondary=LabelLabelType.__table__
    )
