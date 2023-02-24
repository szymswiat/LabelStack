import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base


# TODO: add creation time field (in seconds)
class AnnotationData(Base):
    __tablename__ = "annotation_data"

    annotation_id: Mapped[int | None] = mapped_column(
        sa.Integer, sa.ForeignKey("annotation.id"), nullable=True, primary_key=True
    )
    sequence: Mapped[int] = mapped_column(sa.Integer, nullable=False, primary_key=True)

    data: Mapped[bytes] = mapped_column(sa.LargeBinary, nullable=False, deferred=True)
    md5_hash: Mapped[str] = mapped_column(sa.String, nullable=False)
