from app import models, schemas
from app.crud.base import CRUDBase


class CRUDAnnotation(
    CRUDBase[
        models.Annotation, schemas.AnnotationCreateCrud, schemas.AnnotationUpdateCrud
    ]
):
    pass


annotation = CRUDAnnotation(models.Annotation)
