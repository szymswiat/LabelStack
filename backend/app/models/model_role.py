import sqlalchemy as sa
from sqlalchemy import Identity
from app.db.base_class import Base


# TODO: add permissions?
class Role(Base):
    __tablename__ = "role"

    id = sa.Column(sa.Integer, Identity(always=True), primary_key=True)

    type = sa.Column(sa.String, nullable=False, unique=True)
