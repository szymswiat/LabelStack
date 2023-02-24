from typing import TYPE_CHECKING
import sqlalchemy as sa
from sqlalchemy import Identity
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.db.base_class import Base

if TYPE_CHECKING:
    from app import models


class ImageInstance(Base):
    __tablename__ = "image_instance"

    id: Mapped[int] = mapped_column(sa.Integer, Identity(always=True), primary_key=True)
    id_ref: Mapped[str] = mapped_column(sa.String, nullable=False, unique=True)

    visited: Mapped[bool] = mapped_column(sa.Boolean, nullable=False, default=False)

    label_assignments: Mapped[list["models.LabelAssignment"]] = relationship(
        "LabelAssignment",
        back_populates="image_instance",
        cascade="delete, delete-orphan",
    )

    tags: Mapped[list["models.ImageInstanceTagValue"]] = relationship("ImageInstanceTagValue")
