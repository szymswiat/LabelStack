from enum import Enum, auto
from typing import Any


class LogicErrorCode(int, Enum):
    invalid_status_change = auto()

    dicom_already_in_label_task = auto()
    dicom_and_label_combo_already_in_task = auto()

    task_missing_assigned_user = auto()
    task_input_misaligned = auto()

    annotation_not_finished = auto()
    annotation_missing_data_blob = auto()
    annotation_already_in_review_task = auto()
    annotation_not_waiting_for_review = auto()

    review_not_finished = auto()
    review_valid_with_annotation = auto()
    review_invalid_no_annotation = auto()

    label_assignment_already_annotated = auto()


class LogicError(Exception):
    def __init__(self, error_code: LogicErrorCode, **kwargs: Any):
        self.error_code = error_code

        self.extra = kwargs
