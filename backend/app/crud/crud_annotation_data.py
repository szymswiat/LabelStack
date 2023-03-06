from app import models, schemas
from app.crud.base import CRUDBase


class CRUDAnnotationData(
    CRUDBase[
        models.AnnotationData,
        schemas.AnnotationDataCreateCrud,
        schemas.AnnotationDataUpdateCrud,
    ]
):
    pass


annotation_data = CRUDAnnotationData(models.AnnotationData)
