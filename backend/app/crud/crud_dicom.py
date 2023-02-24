from app import models, schemas
from app.crud.base import CRUDBase


class CRUDDicom(CRUDBase[models.Dicom, schemas.DicomCreateCrud, schemas.DicomUpdateCrud]):
    pass


dicom = CRUDDicom(models.Dicom)
