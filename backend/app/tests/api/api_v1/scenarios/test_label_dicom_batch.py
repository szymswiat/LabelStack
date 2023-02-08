import random
from typing import List

import pytest
from sqlalchemy.orm import Session
from starlette.testclient import TestClient

from app import schemas
from app.core.config import settings
from app.tests.utils.user import auth_data_for_test_user

ANNOTATOR_0_LABEL_TASK_DICOM_COUNT = 10
ANNOTATOR_1_LABEL_TASK_DICOM_COUNT = 5

random.seed(0)

TEST_OUTPUTS = {}


def test_step0_create_label_task(client: TestClient, db: Session):
    """
    Create label task for annotator_0 with 50 dicoms. This task will be finished in below tests.
    """
    task_admin_0, task_admin_0_headers = auth_data_for_test_user(
        db, client, schemas.RoleType.task_admin, 0
    )
    annotator_0, annotator_0_headers = auth_data_for_test_user(
        db, client, schemas.RoleType.annotator, 0
    )

    # fetch image instances waiting for labels
    r = client.get(
        f"{settings.API_V1_STR}/image_instances/?"
        f"waiting_for=label&"
        f"without_active_task=true",
        headers=task_admin_0_headers,
    )
    assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"
    image_instances = [schemas.ImageInstanceApiOut.parse_obj(d) for d in r.json()]

    task_create = schemas.TaskCreateApiIn(
        assigned_user_id=annotator_0.id,
        task_type=schemas.TaskType.label_assignment,
        name="First label task",
        description="Label all images in the database.",
        image_instance_ids=[
            image_instance.id
            for image_instance in image_instances[:ANNOTATOR_0_LABEL_TASK_DICOM_COUNT]
        ],
    )

    # create label task assigned to annotator_0
    r = client.post(
        f"{settings.API_V1_STR}/tasks/",
        headers=task_admin_0_headers,
        json=task_create.dict(),
    )
    assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"

    TEST_OUTPUTS["step0"] = {"image_instances": image_instances}


def test_step0_1_create_additional_label_task(client: TestClient, db: Session):
    """
    Create label task for annotator_1 with 25 dicoms. Below tests will not finish it. It will just hang in open state.
    """
    task_admin_0, task_admin_0_headers = auth_data_for_test_user(
        db, client, schemas.RoleType.task_admin, 0
    )
    annotator_1, annotator_1_headers = auth_data_for_test_user(
        db, client, schemas.RoleType.annotator, 1
    )

    image_instances: List[schemas.ImageInstanceApiOut] = TEST_OUTPUTS["step0"][
        "image_instances"
    ]

    task_create = schemas.TaskCreateApiIn(
        assigned_user_id=annotator_1.id,
        task_type=schemas.TaskType.label_assignment,
        name="First label task",
        description="Label all images in the database.",
        image_instance_ids=[
            image_instance.id
            for image_instance in image_instances[ANNOTATOR_0_LABEL_TASK_DICOM_COUNT:][
                :ANNOTATOR_1_LABEL_TASK_DICOM_COUNT
            ]
        ],
    )

    # create label task assigned to annotator_0
    r = client.post(
        f"{settings.API_V1_STR}/tasks/",
        headers=task_admin_0_headers,
        json=task_create.dict(),
    )
    assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"


@pytest.mark.order(after="test_step0_create_label_task")
def test_step1_assign_labels(client: TestClient, db: Session):
    annotator_0, annotator_0_headers = auth_data_for_test_user(
        db, client, schemas.RoleType.annotator, 0
    )

    # fetch label tasks on behalf annotator_0
    r = client.get(
        f"{settings.API_V1_STR}/tasks/?"
        f"for_me=true&"
        f"task_type={schemas.TaskType.label_assignment.value}",
        headers=annotator_0_headers,
    )
    assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"
    annotator_tasks = [schemas.TaskApiOut.parse_obj(d) for d in r.json()]
    # fetch label list
    r = client.get(f"{settings.API_V1_STR}/labels/", headers=annotator_0_headers)
    assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"
    all_labels = [schemas.LabelApiOut.parse_obj(d) for d in r.json()]

    label_task = annotator_tasks[0]
    assert (
        len(label_task.image_instances) == ANNOTATOR_0_LABEL_TASK_DICOM_COUNT
    ), f"{r.status_code}: {r.content}"

    r = client.post(
        f"{settings.API_V1_STR}/tasks/change_status/{label_task.id}?"
        f"new_status={schemas.TaskStatus.in_progress.value}",
        headers=annotator_0_headers,
    )
    assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"

    # annotate images
    image_instances = label_task.image_instances

    # TODO: add create multiple?
    # annotate all images in task on behalf annotator_0
    for image_instance in image_instances:
        annotation = schemas.LabelAssignmentsModifyApiIn(
            image_instance_id=image_instance.id,
            label_ids_to_create=[
                label.id for label in random.sample(all_labels, k=random.randint(4, 10))
            ],
            label_ids_to_remove=[],
            parent_task_id=label_task.id,
        )
        r = client.post(
            f"{settings.API_V1_STR}/label_assignments/for_image_instance",
            headers=annotator_0_headers,
            json=annotation.dict(),
        )
        assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"

    TEST_OUTPUTS["step1"] = {"label_task": label_task}


@pytest.mark.order(after="test_step1_assign_labels")
def test_step2_finish_label_task(client: TestClient, db: Session):
    annotator_0, annotator_0_headers = auth_data_for_test_user(
        db, client, schemas.RoleType.annotator, 0
    )

    label_task: schemas.TaskApiOut = TEST_OUTPUTS["step1"]["label_task"]

    r = client.post(
        f"{settings.API_V1_STR}/tasks/change_status/{label_task.id}?"
        f"new_status={schemas.TaskStatus.done.value}",
        headers=annotator_0_headers,
    )
    assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"
