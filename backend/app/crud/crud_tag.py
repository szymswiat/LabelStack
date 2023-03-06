from app import models, schemas
from app.crud.base import CRUDBase


class CRUDTag(CRUDBase[models.Tag, schemas.TagCreateCrud, schemas.TagUpdateCrud]):
    pass


tag = CRUDTag(models.Tag)
