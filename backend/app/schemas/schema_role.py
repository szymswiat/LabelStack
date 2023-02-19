from __future__ import annotations
from enum import Enum

from pydantic import BaseModel


class RoleType(str, Enum):
    superuser = "superuser"
    task_admin = "task_admin"
    data_admin = "data_admin"
    annotator = "annotator"

    @staticmethod
    def all_roles() -> list[RoleType]:
        return [
            RoleType.superuser,
            RoleType.task_admin,
            RoleType.data_admin,
            RoleType.annotator,
        ]


class RoleCreateCrud(BaseModel):
    type: RoleType


class RoleUpdateCrud(BaseModel):
    type: RoleType


class Role(BaseModel):
    id: int
    type: RoleType

    class Config:
        orm_mode = True


class RoleApiOut(Role):
    pass
