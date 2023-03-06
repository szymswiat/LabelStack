from sqlalchemy.orm import Session, Query

from app import models, schemas
from app.query.base import QueryBase


class QueryUser(QueryBase[models.User]):
    def query_by_email(self, db: Session, *, email: str) -> Query:
        return self.query(db).filter(models.User.email == email)


user = QueryUser(models.User)
