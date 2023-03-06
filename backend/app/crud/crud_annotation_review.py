from app import models, schemas
from app.crud.base import CRUDBase


class CRUDAnnotationReview(
    CRUDBase[
        models.AnnotationReview,
        schemas.AnnotationReviewCreateCrud,
        schemas.AnnotationReviewUpdateCrud,
    ]
):
    pass


annotation_review = CRUDAnnotationReview(models.AnnotationReview)
