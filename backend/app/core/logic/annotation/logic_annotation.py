from typing import List

from sqlalchemy import null
from sqlalchemy.orm import Session

from app import schemas, models, crud
from app.core.logic.image_instance import get_all_image_instances_for_task


def is_annotation_waiting_for_review(
    annotation: schemas.Annotation, required_accepted_reviews: int
) -> bool:
    if annotation.status != schemas.AnnotationStatus.done:
        return True
    if len(annotation.reviews) < required_accepted_reviews:
        return True
    reviews_to_check = annotation.reviews[-required_accepted_reviews:]
    last_review = reviews_to_check[-1]

    if last_review.result == schemas.AnnotationReviewResult.denied:
        return True
    if last_review.result == schemas.AnnotationReviewResult.denied_corrected:
        return False

    for review in reviews_to_check:
        if review.status != schemas.AnnotationReviewStatus.done:
            return True
        if review.result != schemas.AnnotationReviewResult.accepted:
            return True

    return False


def filter_annotations_waiting_for_review(
    annotations: List[schemas.Annotation], required_accepted_reviews: int = 1
) -> List[schemas.Annotation]:
    annotations_out = []

    for annotation in annotations:
        if is_annotation_waiting_for_review(annotation, required_accepted_reviews):
            annotations_out.append(annotation)

    return annotations_out


def change_annotation_review_result(
    db: Session,
    annotation_review: models.AnnotationReview,
    new_result: schemas.AnnotationReviewResult,
    commit_changes: bool = True,
) -> models.AnnotationReview:
    Result = schemas.AnnotationReviewResult

    if annotation_review.result == new_result:
        return annotation_review

    if new_result == Result.denied_corrected:
        # create new resulting annotation
        parent_annotation: models.Annotation = crud.annotation.get(
            db, annotation_review.annotation_id
        )
        new_annotation = schemas.AnnotationCreateCrud(
            label_assignment_id=parent_annotation.label_assignment_id,
            parent_task_id=annotation_review.parent_task_id,
            author_id=annotation_review.author_id,
            version=parent_annotation.version + 1,
            status=schemas.AnnotationStatus.open,
            spent_time=0,
        )
        new_annotation = crud.annotation.create(
            db, obj_in=new_annotation, commit=commit_changes
        )
        annotation_review.resulting_annotation_id = new_annotation.id

    if annotation_review.result == Result.denied_corrected:
        # drop resulting annotation
        annotation_id_to_remove = annotation_review.resulting_annotation_id
        annotation_review.resulting_annotation_id = null()
        annotation_to_remove = crud.annotation.get(db, id=annotation_id_to_remove)
        annotation_to_remove.data_list = []
        db.flush()
        crud.annotation.remove(db, id=annotation_id_to_remove, commit=commit_changes)

    annotation_review.result = new_result

    return annotation_review


def get_all_annotations_from_task(task: models.Task) -> List[models.Annotation]:
    all_image_instances = get_all_image_instances_for_task(task)

    annotations = [
        annotation
        for image_instance in all_image_instances
        for label_assignment in image_instance.label_assignments
        for annotation in label_assignment.annotations
    ]

    return annotations
