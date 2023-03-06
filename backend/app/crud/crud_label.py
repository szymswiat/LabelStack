from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app import models, schemas


class CRUDLabel(
    CRUDBase[models.Label, schemas.LabelCreateCrud, schemas.LabelUpdateCrud]
):
    def schema_to_model_create(
        self, db: Session, *, create_obj: schemas.LabelCreateCrud
    ) -> models.Label:
        types = (
            db.query(models.LabelType)
            .filter(models.LabelType.id.in_(create_obj.type_ids))
            .all()
        )

        label_attrs = create_obj.dict(exclude={"type_ids"})

        return models.Label(**label_attrs, types=types)

    def schema_to_model_update(
        self, db: Session, *, db_obj: models.Label, update_obj: schemas.LabelUpdateCrud
    ) -> models.Label:
        types = (
            db.query(models.LabelType)
            .filter(models.LabelType.id.in_(update_obj.type_ids))
            .all()
        )

        db_obj.name = update_obj.name
        db_obj.types = types

        return db_obj


label = CRUDLabel(models.Label)
