from pathlib import Path
from typing import List, Tuple

import pandas as pd
from sqlalchemy.orm import Session

from app import crud, query, schemas, models
from app.core.config import settings

resources_root = Path(settings.TEST_INIT_DATA_ROOT)


def label_types_create_data() -> List[schemas.LabelTypeCreateCrud]:
    label_types = pd.read_csv(resources_root / "label_types.csv")["label_type"].tolist()

    data = [schemas.LabelTypeCreateCrud(name=lt) for lt in label_types]
    return data


def annotation_types_create_data() -> List[schemas.AnnotationTypeCreateCrud]:
    annotation_types = pd.read_csv(resources_root / "annotation_types.csv")[
        "annotation_type"
    ].tolist()

    data = [schemas.AnnotationTypeCreateCrud(name=at) for at in annotation_types]
    return data


def tags_create_data() -> List[schemas.TagCreateCrud]:
    tags_df = pd.read_csv(resources_root / "tags.csv", sep="|")

    data = []
    for i, row in tags_df.iterrows():
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


def labels_create_data(db: Session) -> List[schemas.LabelCreateCrud]:
    labels_df = pd.read_csv(resources_root / "labels.csv")
    label_types = crud.label_type.get_multi(db)
    segment_annotation_type: models.AnnotationType = (
        query.annotation_type.query_by_name(db, "segment").first()
    )

    data = []
    for _, row in labels_df.iterrows():
        row = row.to_dict()
        type_ids = []
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
