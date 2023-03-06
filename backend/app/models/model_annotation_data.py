import sqlalchemy as sa
from sqlalchemy.orm import deferred

from app.db.base_class import Base


# TODO: add creation time field (in seconds)
class AnnotationData(Base):
    __tablename__ = "annotation_data"

    annotation_id = sa.Column(
        sa.Integer, sa.ForeignKey("annotation.id"), nullable=True, primary_key=True
    )
    sequence = sa.Column(sa.Integer, nullable=False, primary_key=True)

    data = deferred(sa.Column(sa.LargeBinary, nullable=False))
    md5_hash = sa.Column(sa.String, nullable=False)
