from sqlalchemy.orm import Session, Query

from app import models
from app.query.base import QueryBase


class QueryDicom(QueryBase[models.Dicom]):
    def query_by_instance_id(self, db: Session, *, instance_id: str) -> Query:
        return self.query(db).filter(models.Dicom.instance_id == instance_id)

    def query_by_series_id(self, db: Session, *, series_id: str) -> Query:
        return self.query(db).filter(models.Dicom.series_id == series_id)


dicom = QueryDicom(models.Dicom)
