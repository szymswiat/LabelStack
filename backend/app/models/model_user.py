from typing import TYPE_CHECKING
import sqlalchemy as sa

from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.db.base_class import Base
from app.models.model_associations import UserRole


if TYPE_CHECKING:
    from app import models


class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True)

    full_name: Mapped[str] = mapped_column(sa.String)
    email: Mapped[str] = mapped_column(sa.String, unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(sa.String, nullable=False)
    is_active: Mapped[bool] = mapped_column(sa.Boolean(), default=True)

    roles: Mapped[list["models.Role"]] = relationship(
        "Role", secondary=UserRole.__table__, lazy="immediate"
    )
