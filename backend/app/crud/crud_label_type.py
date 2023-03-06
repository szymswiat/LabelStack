from app import models, schemas
from app.crud.base import CRUDBase


class CRUDLabelType(
    CRUDBase[models.LabelType, schemas.LabelTypeCreateCrud, schemas.LabelTypeUpdateCrud]
):
    pass


label_type = CRUDLabelType(models.LabelType)
