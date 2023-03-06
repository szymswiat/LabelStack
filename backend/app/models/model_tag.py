import sqlalchemy as sa
from sqlalchemy import Identity
from app.db.base_class import Base


class Tag(Base):
    __tablename__ = "tag"

    id = sa.Column(sa.Integer, Identity(always=True), primary_key=True)

    tag_group = sa.Column(sa.Integer, nullable=False)
    tag_element = sa.Column(sa.Integer, nullable=False)

    name = sa.Column(sa.String, nullable=False)
    keyword = sa.Column(sa.String, nullable=False)

    __table_args__ = (sa.UniqueConstraint("tag_group", "tag_element"),)

    @property
    def group_element_id(self) -> str:
        return f"{self.tag_group:04X}{self.tag_element:04X}"
