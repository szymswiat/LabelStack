import sqlalchemy as sa
from sqlalchemy import Identity
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base_class import Base


# TODO: add permissions?
class Role(Base):
    __tablename__ = "role"

    id: Mapped[int] = mapped_column(sa.Integer, Identity(always=True), primary_key=True)

    type: Mapped[int] = mapped_column(sa.String, nullable=False, unique=True)
