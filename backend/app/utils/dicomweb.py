from typing import Any
from typing_extensions import Self

from sqlalchemy.orm import Session

from app import models, crud


ADDITIONAL_TAGS_TO_FETCH: list[str] = [
    "ScanOptions",
]


class DicomTags:
    def __init__(self, tags: list[models.Tag]) -> None:
        self.tags = tags
        self.tags_by_keyword = {tag.keyword: tag for tag in self.tags}
        # tags by group and element
        self.tags_by_ge = {tag.group_element_id: tag for tag in self.tags}

    @classmethod
    def build(cls, db: Session) -> Self:
        tags = crud.tag.get_multi(db, limit=100000)

        return cls(tags)

    def get_by_keyword(self, keyword: str) -> models.Tag:
        return self.tags_by_keyword[keyword]

    def get_by_group_element(self, ge_str: str) -> models.Tag:
        return self.tags_by_ge[ge_str]


class DicomWebQidoInstance:

    TAGS: DicomTags

    def __init__(
        self,
        data: dict[str, Any],
    ) -> None:
        self.data = data

    @classmethod
    def bind_tags(cls, tags: DicomTags):
        cls.TAGS = tags

    def has_tag(self, tag: models.Tag) -> bool:
        return tag.group_element_id in self.data

    def has_tag_by_keyword(self, keyword: str) -> bool:
        return self.has_tag(self.TAGS.get_by_keyword(keyword))

    def get_tag_value(
        self,
        tag: models.Tag,
        *,
        allow_empty: bool = False,
        pop: bool = False,
    ) -> str:
        if tag.group_element_id not in self.data:
            if allow_empty is False:
                raise ValueError("Missing tag value.")
            return ""

        if pop:
            dicomweb_tag_item = self.data.pop(tag.group_element_id)
        else:
            dicomweb_tag_item = self.data[tag.group_element_id]

        if "Value" in dicomweb_tag_item:
            tag_value = dicomweb_tag_item["Value"][0]
        else:
            if allow_empty is False:
                raise ValueError("Missing tag value.")
            tag_value = ""

        return tag_value

    def get_tag_by_keyword(
        self,
        keyword: str,
        *,
        allow_empty: bool = False,
        pop: bool = False,
    ) -> str:
        return self.get_tag_value(
            self.TAGS.get_by_keyword(keyword),
            allow_empty=allow_empty,
            pop=pop,
        )

    def get_tag_by_ge(
        self,
        group_element: str,
        *,
        allow_empty: bool = False,
        pop: bool = False,
    ) -> str:
        return self.get_tag_value(
            self.TAGS.get_by_group_element(group_element),
            allow_empty=allow_empty,
            pop=pop,
        )

    def remove_tag(self, tag: models.Tag):
        self.data.pop(tag.group_element_id)
