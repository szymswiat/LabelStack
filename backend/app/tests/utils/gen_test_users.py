from app import schemas


def generate_test_users() -> dict[schemas.RoleType, list]:
    dev_users = [
        (schemas.RoleType.task_admin, 2),
        (schemas.RoleType.data_admin, 3),
        (schemas.RoleType.annotator, 10),
    ]

    users = {}
    for role_type, count in dev_users:
        role_users = []
        users[role_type] = role_users
        for i in range(count):
            username = f"{role_type.value}_{i}"
            role_users.append(
                {
                    "email": f"{username}@app.com",
                    "password": username,
                }
            )

    return users


test_users_meta = generate_test_users()
