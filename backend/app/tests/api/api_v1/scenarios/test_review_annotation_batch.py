import random
import pytest

from random import randbytes
from sqlalchemy.orm import Session
from starlette.testclient import TestClient

from app import schemas
from app.core.config import settings
from app.tests.utils.user import auth_data_for_test_user

random.seed(0)

TEST_OUTPUTS = {}


@pytest.mark.order(after="test_label_dicom_batch.py::test_step2_finish_label_task")
def test_step0_create_annotation_review_task(client: TestClient, db: Session):
    task_admin_0, task_admin_0_headers = auth_data_for_test_user(
        db, client, schemas.RoleType.task_admin, 0
    )
    annotator_3, annotator_3_headers = auth_data_for_test_user(
        db, client, schemas.RoleType.annotator, 3
    )

    # fetch annotation waiting for review
    r = client.get(
        f"{settings.API_V1_STR}/annotations/?"
        f"waiting_for_review=true&"
        f"without_active_task=true",
        headers=task_admin_0_headers,
    )
    assert 200 <= r.status_code < 300
    annotations_waiting_for_review: list[schemas.AnnotationApiOut] = [
        schemas.AnnotationApiOut.parse_obj(d) for d in r.json()
    ]

    task_create = schemas.TaskCreateApiIn(
        assigned_user_id=annotator_3.id,
        task_type=schemas.TaskType.annotation_review,
        name="First annotation review task",
        description="Review assigned annotations.",
        annotation_ids=[a.id for a in annotations_waiting_for_review],
    )

    r = client.post(
        f"{settings.API_V1_STR}/tasks/",
        headers=task_admin_0_headers,
        json=task_create.dict(),
    )
    assert 200 <= r.status_code < 300


@pytest.mark.order(after="test_step0_create_annotation_review_task")
def test_step1_change_task_status(client: TestClient, db: Session):
    annotator_3, annotator_3_headers = auth_data_for_test_user(
        db, client, schemas.RoleType.annotator, 3
    )

    # fetch annotation tasks on behalf annotator_1
    r = client.get(
        f"{settings.API_V1_STR}/tasks/?"
        f"for_me=true&"
        f"task_type={schemas.TaskType.annotation_review.value}",
        headers=annotator_3_headers,
    )
    assert 200 <= r.status_code < 300
    annotator_tasks: list[schemas.TaskApiOut] = [
        schemas.TaskApiOut.parse_obj(d) for d in r.json()
    ]
    # pick first annotator task
    review_task = annotator_tasks[0]

    # change status to in_progress
    r = client.post(
        f"{settings.API_V1_STR}/tasks/change_status/{review_task.id}?"
        f"new_status={schemas.TaskStatus.in_progress.value}",
        headers=annotator_3_headers,
    )
    assert 200 <= r.status_code < 300
    review_task = schemas.TaskApiOut.parse_obj(r.json())

    TEST_OUTPUTS["step1"] = {"review_task": review_task}


@pytest.mark.order(after="test_step1_change_task_status")
def test_step2_fill_reviews_with_data(client: TestClient, db: Session):
    annotator_3, annotator_3_headers = auth_data_for_test_user(
        db, client, schemas.RoleType.annotator, 3
    )

    review_task: schemas.TaskApiOut = TEST_OUTPUTS["step1"]["review_task"]

    r = client.get(
        f"{settings.API_V1_STR}/annotation_reviews/?" f"by_task_id={review_task.id}",
        headers=annotator_3_headers,
    )
    assert 200 <= r.status_code < 300
    task_reviews: list[schemas.AnnotationReviewApiOut] = [
        schemas.AnnotationReviewApiOut.parse_obj(d) for d in r.json()
    ]

    reviews_to_accept = task_reviews[:5]
    # mark as invalid
    reviews_to_deny = task_reviews[5:7]
    # mark as invalid corrected
    reviews_to_deny_and_correct = task_reviews[7:]

    for review in reviews_to_accept:
        review_update_obj = schemas.AnnotationReviewUpdateApiIn(
            result=schemas.AnnotationReviewResult.accepted
        )
        r = client.put(
            f"{settings.API_V1_STR}/annotation_reviews/{review.id}",
            headers=annotator_3_headers,
            json=review_update_obj.dict(),
        )
        assert 200 <= r.status_code < 300

    for review in reviews_to_deny:
        review_update_obj = schemas.AnnotationReviewUpdateApiIn(
            result=schemas.AnnotationReviewResult.denied
        )
        r = client.put(
            f"{settings.API_V1_STR}/annotation_reviews/{review.id}",
            headers=annotator_3_headers,
            json=review_update_obj.dict(),
        )
        assert 200 <= r.status_code < 300

    for review in reviews_to_deny_and_correct:
        review_update_obj = schemas.AnnotationReviewUpdateApiIn(
            result=schemas.AnnotationReviewResult.denied_corrected
        )
        r = client.put(
            f"{settings.API_V1_STR}/annotation_reviews/{review.id}",
            headers=annotator_3_headers,
            json=review_update_obj.dict(),
        )
        assert 200 <= r.status_code < 300
        changed_review = schemas.AnnotationReviewApiOut.parse_obj(r.json())

        # upload several drafts per annotation
        for _ in range(random.randint(5, 20)):
            r = client.post(
                f"{settings.API_V1_STR}/annotation_data/{changed_review.resulting_annotation_id}",
                headers=annotator_3_headers,
                files={
                    "annotation_data": randbytes(random.randint(1024 * 50, 1024 * 100))
                },
            )
            assert 200 <= r.status_code < 300


@pytest.mark.order(after="test_step2_fill_reviews_with_data")
def test_step3_close_annotation_review_task(client: TestClient, db: Session):
    annotator_3, annotator_3_headers = auth_data_for_test_user(
        db, client, schemas.RoleType.annotator, 3
    )

    review_task: schemas.TaskApiOut = TEST_OUTPUTS["step1"]["review_task"]

    r = client.post(
        f"{settings.API_V1_STR}/tasks/change_status/{review_task.id}?"
        f"new_status={schemas.TaskStatus.done.value}",
        headers=annotator_3_headers,
    )
    assert 200 <= r.status_code < 300
