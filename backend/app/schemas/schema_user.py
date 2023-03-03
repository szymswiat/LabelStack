from pydantic import BaseModel, EmailStr

from app.schemas.schema_role import Role


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


class UserUpdateMe(BaseModel):
    password: str | None = None
    full_name: str | None = None
    email: EmailStr | None = None


class UserInDBBase(BaseModel):
    id: int | None = None
    email: EmailStr | None = None
    is_active: bool | None = True
    full_name: str | None = None

    roles: list[Role]

    class Config:
        orm_mode = True


class UserInDB(UserInDBBase):
    hashed_password: str


class UserResponse(UserInDBBase):
    pass
