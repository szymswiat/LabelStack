from typing import Optional, List
from pydantic import BaseModel, EmailStr

from app.schemas import RoleApiOut


class UserCRUDBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    full_name: Optional[str] = None
    role_ids: Optional[List[int]] = None


class UserCreate(UserCRUDBase):
    email: EmailStr
    password: str


class UserUpdate(UserCRUDBase):
    password: Optional[str] = None


class UserInDBBase(BaseModel):
    id: Optional[int] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    full_name: Optional[str] = None

    roles: List[RoleApiOut]

    class Config:
        orm_mode = True


class UserInDB(UserInDBBase):
    hashed_password: str


class UserResponse(UserInDBBase):
    pass
