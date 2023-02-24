import random
from random import randbytes

import pytest
from sqlalchemy.orm import Session
from starlette.testclient import TestClient

from app import schemas
from app.core.config import settings
from app.tests.utils.user import auth_data_for_test_user

random.seed(0)

TEST_OUTPUTS = {}


@pytest.mark.order(after="test_label_dicom_batch.py::test_step2_finish_label_task")
def test_step0_create_annotation_task(client: TestClient, db: Session):
    _, task_admin_0_headers = auth_data_for_test_user(
        db, client, schemas.RoleType.task_admin, 0
    )
    annotator_2, _ = auth_data_for_test_user(db, client, schemas.RoleType.annotator, 2)

    r = client.get(
        f"{settings.API_V1_STR}/labels/?with_allowed_annotation_type_name=segment",
        headers=task_admin_0_headers,
    )
    assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"
    segmentable_labels: list[schemas.LabelApiOut] = [
        schemas.LabelApiOut.parse_obj(d) for d in r.json()
    ]

    # fetch label assignments waiting for annotation task
    r = client.get(
        f"{settings.API_V1_STR}/label_assignments/?"
        f"waiting_for_annotations=true&"
        f"without_active_task=true",
        headers=task_admin_0_headers,
    )
    assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"
    labels_assignments_to_annotate: list[schemas.LabelAssignmentApiOut] = [
        schemas.LabelAssignmentApiOut.parse_obj(d) for d in r.json()
    ]

    # fetch all annotation types
    r = client.get(
        f"{settings.API_V1_STR}/annotation_types/",
        headers=task_admin_0_headers,
    )
    assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"

    # group label_assignments by label_id
    grouped_by_label: dict[int, list[schemas.LabelAssignmentApiOut]] = {}
    labels_by_id = {label.id: label for label in segmentable_labels}

    for label in segmentable_labels:
        for assignment in labels_assignments_to_annotate:
            if assignment.label_id == label.id:
                if label.id not in grouped_by_label:
                    grouped_by_label[label.id] = []
                grouped_by_label[label.id].append(assignment)

    # create separate tasks for each label (with label assignment list)
    for i, (label_id, assignments) in enumerate(list(grouped_by_label.items())[:10]):
        label = labels_by_id[label_id]
        task_create = schemas.TaskCreateApiIn(
            assigned_user_id=annotator_2.id,
            task_type=schemas.TaskType.annotation,
            name=f"Segment task {i}",
            description=f"Segment images with '{label.name}' label.",
            label_assignment_ids=[a.id for a in assignments],
        )

        r = client.post(
            f"{settings.API_V1_STR}/tasks/",
            headers=task_admin_0_headers,
            json=task_create.dict(),
        )
        assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"


@pytest.mark.order(after="test_step0_create_annotation_task")
def test_step1_upload_data_for_annotations(client: TestClient, db: Session):
    _, annotator_2_headers = auth_data_for_test_user(
        db, client, schemas.RoleType.annotator, 2
    )

    # fetch annotation tasks on behalf annotator_1
    r = client.get(
        f"{settings.API_V1_STR}/tasks/?"
        f"for_me=true&"
        f"task_type={schemas.TaskType.annotation.value}",
        headers=annotator_2_headers,
    )
    assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"
    annotator_tasks = [schemas.TaskApiOut.parse_obj(d) for d in r.json()]

    # pick first annotator task
    annotation_task = annotator_tasks[0]

    # change task status to in_progress
    r = client.post(
        f"{settings.API_V1_STR}/tasks/change_status/{annotation_task.id}?"
        f"new_status={schemas.TaskStatus.in_progress.value}",
        headers=annotator_2_headers,
    )
    assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"

    # fetch annotations bound to task
    r = client.get(
        f"{settings.API_V1_STR}/annotations/?" f"by_task_id={annotation_task.id}",
        headers=annotator_2_headers,
    )
    assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"
    annotations_for_task = [schemas.AnnotationApiOut.parse_obj(d) for d in r.json()]

    for annotation in annotations_for_task:
        # upload several drafts per annotation
        for _ in range(random.randint(5, 20)):
            r = client.post(
                f"{settings.API_V1_STR}/annotation_data/{annotation.id}",
                headers=annotator_2_headers,
                files={
                    "annotation_data": randbytes(random.randint(1024 * 50, 1024 * 100))
                },
            )
            assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"

    # fetch annotations bound to task
    r = client.get(
        f"{settings.API_V1_STR}/annotations/?" f"by_task_id={annotation_task.id}",
        headers=annotator_2_headers,
    )
    assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"
    annotations_for_task = [schemas.AnnotationApiOut.parse_obj(d) for d in r.json()]

    random_segment_data = annotations_for_task[0].data_list[0]

    r = client.get(
        f"{settings.API_V1_STR}/annotation_data/?"
        f"annotation_id={random_segment_data.annotation_id}&"
        f"sequence={random_segment_data.sequence}&"
        f"task_id={annotation_task.id}",
        headers=annotator_2_headers,
    )
    assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"

    TEST_OUTPUTS["step1"] = {"annotation_task": annotation_task}


@pytest.mark.order(after="test_step1_upload_data_for_annotations")
def test_step2_close_annotation_task(client: TestClient, db: Session):
    _, annotator_2_headers = auth_data_for_test_user(
        db, client, schemas.RoleType.annotator, 2
    )

    annotation_task: schemas.TaskApiOut = TEST_OUTPUTS["step1"]["annotation_task"]

    r = client.post(
        f"{settings.API_V1_STR}/tasks/change_status/{annotation_task.id}?"
        f"new_status={schemas.TaskStatus.done.value}",
        headers=annotator_2_headers,
    )
    assert 200 <= r.status_code < 300, f"{r.status_code}: {r.content}"
