from app import models, schemas
from app.crud.base import CRUDBase


class CRUDAnnotationType(
    CRUDBase[
        models.AnnotationType,
        schemas.AnnotationTypeCreateCrud,
        schemas.AnnotationTypeUpdateCrud,
    ]
):
    pass


annotation_type = CRUDAnnotationType(models.AnnotationType)
