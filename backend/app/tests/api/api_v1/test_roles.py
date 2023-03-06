from typing import List

from sqlalchemy.orm import Session
from starlette.testclient import TestClient

from app import crud, schemas
from app.core.config import settings


def test_read_all_roles(client: TestClient, superuser_token_headers: dict, db: Session):
    roles_db = crud.role.get_multi(db)

    r = client.get(
        f"{settings.API_V1_STR}/roles/",
        headers=superuser_token_headers,
    )
    assert 200 <= r.status_code < 300

    content = r.json()
    assert isinstance(content, list)
    content: List[schemas.RoleApiOut] = [
        schemas.RoleApiOut.parse_obj(obj) for obj in content
    ]

    roles_db = {lt.id: lt for lt in roles_db}
    for role_resp in content:
        assert role_resp.id in roles_db
        assert role_resp.type == roles_db[role_resp.id].type
