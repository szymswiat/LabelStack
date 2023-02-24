from pathlib import Path

import pandas as pd
from sqlalchemy.orm import Session

from app import crud, query, schemas
from app.core.config import settings

resources_root = Path(settings.TEST_INIT_DATA_ROOT)


def label_types_create_data() -> list[schemas.LabelTypeCreateCrud]:
    label_types: list[str] = pd.read_csv(resources_root / "label_types.csv")["label_type"].tolist()  # type: ignore

    data = [schemas.LabelTypeCreateCrud(name=lt) for lt in label_types]
    return data


def annotation_types_create_data() -> list[schemas.AnnotationTypeCreateCrud]:
    annotation_types: list[str] = pd.read_csv(resources_root / "annotation_types.csv")[  # type: ignore
        "annotation_type"
    ].tolist()

    data = [schemas.AnnotationTypeCreateCrud(name=at) for at in annotation_types]
    return data


def tags_create_data() -> list[schemas.TagCreateCrud]:
    tags_df = pd.read_csv(resources_root / "tags.csv", sep="|")  # type: ignore

    data: list[schemas.TagCreateCrud] = []

    row: pd.Series[str]
    for _, row in tags_df.iterrows():  # type: ignore
        if "x" in row["Tag"]:
            continue
        tag_group, tag_element = row["Tag"].split(",")
        tag_group = int(tag_group[1:], base=16)
        tag_element = int(tag_element[:-1], base=16)

        tag = schemas.TagCreateCrud(
            tag_group=tag_group,
            tag_element=tag_element,
            name=row["Name"],
            keyword=row["Keyword"],
        )
        data.append(tag)

    return data


def labels_create_data(db: Session) -> list[schemas.LabelCreateCrud]:
    labels_df = pd.read_csv(resources_root / "labels.csv")  # type: ignore
    label_types = crud.label_type.get_multi(db)
    segment_annotation_type = query.annotation_type.query_by_name(db, "segment").first()

    assert segment_annotation_type

    data: list[schemas.LabelCreateCrud] = []
    row_series: pd.Series[str]
    for _, row_series in labels_df.iterrows():  # type: ignore
        row: dict[str, str] = row_series.to_dict()  # type: ignore
        type_ids: list[int] = []
        for label_type in label_types:
            if label_type.name in row and row[label_type.name] is True:
                type_ids.append(label_type.id)

        create_attrs = {}
        if "segmentable" in row and row["segmentable"] is True:
            create_attrs["allowed_annotation_type_id"] = segment_annotation_type.id

        label = schemas.LabelCreateCrud(
            **create_attrs,
            # name=row['eng_name'], TODO
            name=row["pl_name"],
            type_ids=type_ids
        )
        data.append(label)
    return data
