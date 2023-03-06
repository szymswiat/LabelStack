from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app import models, schemas


class CRUDLabelAssignment(
    CRUDBase[
        models.LabelAssignment,
        schemas.LabelAssignmentCreateCrud,
        schemas.LabelAssignmentUpdateCrud,
    ]
):
    def update(
        self,
        db: Session,
        *,
        db_obj: models.LabelAssignment,
        obj_in: schemas.LabelAssignmentUpdateCrud,
        commit=True
    ) -> models.LabelAssignment:
        raise AttributeError("Unsupported operation for LabelAssignment.")


label_assignment = CRUDLabelAssignment(models.LabelAssignment)
