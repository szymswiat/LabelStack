from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api import deps
from app import models

router = APIRouter()


@router.get("/")
def authenticate(
    *,
    db: Session = Depends(deps.get_db),
    user: models.User = Depends(deps.get_current_user_with_role(deps.RoleType.all_roles())),
    request: Request,
):
    # url_to_auth = request.headers['requested-url']
    pass
