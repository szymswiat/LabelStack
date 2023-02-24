from app import schemas


def generate_test_users() -> dict[schemas.RoleType, list[schemas.UserCreate]]:
    dev_users: list[tuple[schemas.RoleType, int]] = [
        (schemas.RoleType.task_admin, 2),
        (schemas.RoleType.data_admin, 3),
        (schemas.RoleType.annotator, 10),
    ]

    users: dict[schemas.RoleType, list[schemas.UserCreate]] = {}
    for role_type, count in dev_users:
        role_users: list[schemas.UserCreate] = []
        users[role_type] = role_users
        for i in range(count):
            username = f"{role_type.value}_{i}"
            role_users.append(
                schemas.UserCreate.parse_obj(
                    {
                        "email": f"{username}@app.com",
                        "password": username,
                    }
                )
            )

    return users


test_users_meta = generate_test_users()
