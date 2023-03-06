import sqlalchemy as sa

from sqlalchemy.orm import relationship

from app.db.base_class import Base
from app.models.model_associations import UserRole


class User(Base):
    __tablename__ = "user"

    id = sa.Column(sa.Integer, primary_key=True)

    full_name = sa.Column(sa.String)
    email = sa.Column(sa.String, unique=True, nullable=False)
    hashed_password = sa.Column(sa.String, nullable=False)
    is_active = sa.Column(sa.Boolean(), default=True)

    roles = relationship("Role", secondary=UserRole.__table__)
