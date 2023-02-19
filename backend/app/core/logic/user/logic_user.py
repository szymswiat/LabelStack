from app import models, schemas


def is_active(user: models.User) -> bool:
    return user.is_active


def has_role_one_of(user: models.User, role_types: list[schemas.RoleType]):
    for role in user.roles:
        if role.type in role_types:
            return True
    return False
