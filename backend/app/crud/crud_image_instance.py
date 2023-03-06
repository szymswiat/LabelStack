from app import models, schemas
from app.crud.base import CRUDBase


class CRUDImageInstance(
    CRUDBase[
        models.ImageInstance,
        schemas.ImageInstanceCreateCrud,
        schemas.ImageInstanceUpdateCrud,
    ]
):
    pass


image_instance = CRUDImageInstance(models.ImageInstance)
