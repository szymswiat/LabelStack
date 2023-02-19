import sqlalchemy as sa
from sqlalchemy import Identity
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base_class import Base


class Tag(Base):
    __tablename__ = "tag"

    id: Mapped[int] = mapped_column(sa.Integer, Identity(always=True), primary_key=True)

    tag_group: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    tag_element: Mapped[int] = mapped_column(sa.Integer, nullable=False)

    name: Mapped[str] = mapped_column(sa.String, nullable=False)
    keyword: Mapped[str] = mapped_column(sa.String, nullable=False)

    __table_args__ = (sa.UniqueConstraint("tag_group", "tag_element"),)

    @property
    def group_element_id(self) -> str:
        return f"{self.tag_group:04X}{self.tag_element:04X}"
