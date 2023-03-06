# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa

from app.models.model_associations import (
    TaskImageInstance,
    TaskLabelAssignment,
    UserRole,
    LabelLabelType,
)
from app.models.model_dicom import Dicom
from app.models.model_label import Label
from app.models.model_label_type import LabelType
from app.models.model_label_assignment import LabelAssignment
from app.models.model_role import Role
from app.models.model_annotation import Annotation
from app.models.model_annotation_review import AnnotationReview
from app.models.model_task import Task
from app.models.model_user import User  # noqa
