from app import models, schemas
from app.crud.base import CRUDBase


class CRUDRole(CRUDBase[models.Role, schemas.RoleCreateCrud, schemas.RoleUpdateCrud]):
    pass


role = CRUDRole(models.Role)
