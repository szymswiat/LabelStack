import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base_class import Base


class TaskImageInstance(Base):
    __tablename__ = "task__image_instance"

    task_id: Mapped[int] = mapped_column(sa.Integer, sa.ForeignKey("task.id"), primary_key=True)
    image_instance_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("image_instance.id"), primary_key=True
    )


class TaskLabelAssignment(Base):
    __tablename__ = "task__label_assignment"

    task_id: Mapped[int] = mapped_column(sa.Integer, sa.ForeignKey("task.id"), primary_key=True)
    label_assignment_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("label_assignment.id"), primary_key=True
    )


class TaskAnnotation(Base):
    __tablename__ = "task__annotation"

    task_id: Mapped[int] = mapped_column(sa.Integer, sa.ForeignKey("task.id"), primary_key=True)
    annotation_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("annotation.id"), primary_key=True
    )


class UserRole(Base):
    __tablename__ = "user__role"

    user_id: Mapped[int] = mapped_column(sa.Integer, sa.ForeignKey("user.id"), primary_key=True)
    role_id: Mapped[int] = mapped_column(sa.Integer, sa.ForeignKey("role.id"), primary_key=True)


class LabelLabelType(Base):
    __tablename__ = "label__label_type"

    label_id: Mapped[int] = mapped_column(sa.Integer, sa.ForeignKey("label.id"), primary_key=True)
    label_type_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("label_type.id"), primary_key=True
    )
