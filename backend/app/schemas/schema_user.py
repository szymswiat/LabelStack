from pydantic import BaseModel, EmailStr

from app.schemas import RoleApiOut


class UserCRUDBase(BaseModel):
    email: EmailStr | None = None
    is_active: bool | None = True
    full_name: str | None = None
    role_ids: list[int] | None = None


class UserCreate(UserCRUDBase):
    email: EmailStr
    password: str


class UserUpdate(UserCRUDBase):
    password: str | None = None


class UserInDBBase(BaseModel):
    id: int | None = None
    email: EmailStr | None = None
    is_active: bool | None = True
    full_name: str | None = None

    roles: list[RoleApiOut]

    class Config:
        orm_mode = True


class UserInDB(UserInDBBase):
    hashed_password: str


class UserResponse(UserInDBBase):
    pass
