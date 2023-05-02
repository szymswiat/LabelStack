from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app import models, schemas
from app.api import deps

router = APIRouter()


@router.get("/")
def authenticate(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user_with_role(schemas.RoleType.all_roles())),
    request: Request,
):
    url_to_auth = request.headers['requested-url']
    pass
