from sqlalchemy.orm import Session, Query

from app import models
from app.query.base import QueryBase


Query = Query[models.Tag]


class QueryTag(QueryBase[models.Tag]):
    def query_by_keyword(self, db: Session, keyword: str) -> Query:
        return self.query(db).filter(models.Tag.keyword == keyword)

    def query_by_group_and_element(
        self, db: Session, group: int, element: int
    ) -> Query:
        return (
            self.query(db)
            .filter(models.Tag.tag_group == group)
            .filter(models.Tag.tag_element == element)
        )


tag = QueryTag(models.Tag)
