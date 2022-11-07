"""create annotator tables

Revision ID: c500e2bdbad4
Revises: d4867f3a4c0a
Create Date: 2021-12-09 02:11:47.528174

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import Identity

# revision identifiers, used by Alembic.
revision = "c500e2bdbad4"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    setup_tables()
    setup_associations()


def setup_tables():
    op.create_table(
        "dicom",
        sa.Column("id", sa.Integer, Identity(always=True)),
        sa.Column("patient_id", sa.String, nullable=False),
        sa.Column("study_id", sa.String, nullable=False),
        sa.Column("series_id", sa.String, nullable=False),
        sa.Column("instance_id", sa.String, nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "image_instance",
        sa.Column("id", sa.Integer, Identity(always=True)),
        sa.Column("id_ref", sa.String, nullable=False),
        sa.Column("is_labeled", sa.Boolean, nullable=False, default=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "tag",
        sa.Column("id", sa.Integer, Identity(always=True)),
        sa.Column("tag_group", sa.Integer, nullable=False),
        sa.Column("tag_element", sa.Integer, nullable=False),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("keyword", sa.String, nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("tag_group", "tag_element"),
    )
    op.create_table(
        "dicom_tag_value",
        sa.Column("dicom_id", sa.Integer),
        sa.Column("tag_id", sa.Integer),
        sa.Column("value", sa.String, nullable=False),
        sa.PrimaryKeyConstraint("dicom_id", "tag_id"),
        sa.ForeignKeyConstraint(["dicom_id"], ["dicom.id"]),
        sa.ForeignKeyConstraint(["tag_id"], ["tag.id"]),
    )
    op.create_table(
        "image_instance_tag_value",
        sa.Column("image_instance_id", sa.Integer),
        sa.Column("tag_id", sa.Integer),
        sa.Column("value", sa.String, nullable=False),
        sa.PrimaryKeyConstraint("image_instance_id", "tag_id"),
        sa.ForeignKeyConstraint(["image_instance_id"], ["image_instance.id"]),
        sa.ForeignKeyConstraint(["tag_id"], ["tag.id"]),
    )
    op.create_table(
        "annotation_type",
        sa.Column("id", sa.Integer, Identity(always=True)),
        sa.Column("name", sa.String, nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "label",
        sa.Column("id", sa.Integer, Identity(always=True)),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("allowed_annotation_type_id", sa.Integer, nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["allowed_annotation_type_id"], ["annotation_type.id"]),
    )
    op.create_table(
        "label_type",
        sa.Column("id", sa.Integer, Identity(always=True)),
        sa.Column("name", sa.String, nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "role",
        sa.Column("id", sa.Integer, Identity(always=True)),
        sa.Column("type", sa.String, nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("type"),
    )
    op.create_table(
        "user",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("full_name", sa.String(), nullable=True),
        sa.Column("email", sa.String(), nullable=True),
        sa.Column("hashed_password", sa.String(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "task",
        sa.Column("id", sa.Integer, Identity(always=True)),
        sa.Column("assigned_user_id", sa.Integer, nullable=True),
        sa.Column("submitter_user_id", sa.Integer, nullable=False),
        sa.Column("task_type", sa.Integer, nullable=False),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("description", sa.String, nullable=True),
        sa.Column("priority", sa.Integer, nullable=True, default=0),
        sa.Column("status", sa.Integer, nullable=False),
        sa.Column("total_time", sa.BigInteger, nullable=False, default=0),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["assigned_user_id"], ["user.id"]),
        sa.ForeignKeyConstraint(["submitter_user_id"], ["user.id"]),
    )
    op.create_table(
        "label_assignment",
        sa.Column("id", sa.Integer, Identity(always=True)),
        sa.Column("label_id", sa.Integer, nullable=False),
        sa.Column("image_instance_id", sa.Integer, nullable=False),
        sa.Column("author_id", sa.Integer, nullable=False),
        sa.Column("parent_task_id", sa.Integer, nullable=True),
        sa.Column("is_annotated", sa.Boolean, default=False, nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("label_id", "image_instance_id"),
        sa.ForeignKeyConstraint(["label_id"], ["label.id"]),
        sa.ForeignKeyConstraint(["image_instance_id"], ["image_instance.id"]),
        sa.ForeignKeyConstraint(["author_id"], ["user.id"]),
        sa.ForeignKeyConstraint(["parent_task_id"], ["task.id"]),
    )
    op.create_table(
        "annotation",
        sa.Column("id", sa.Integer, Identity(always=True)),
        sa.Column("label_assignment_id", sa.Integer, nullable=False),
        sa.Column("author_id", sa.Integer, nullable=False),
        sa.Column("parent_task_id", sa.Integer, nullable=False),
        sa.Column("version", sa.Integer, nullable=False),
        sa.Column("spent_time", sa.BigInteger, nullable=False, default=0),
        sa.Column("status", sa.Integer, nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["label_assignment_id"], ["label_assignment.id"]),
        sa.ForeignKeyConstraint(["author_id"], ["user.id"]),
        sa.ForeignKeyConstraint(["parent_task_id"], ["task.id"]),
        sa.UniqueConstraint("label_assignment_id", "version"),
    )
    op.create_table(
        "annotation_data",
        sa.Column("annotation_id", sa.Integer),
        sa.Column("sequence", sa.Integer, nullable=False),
        sa.Column("data", sa.LargeBinary, nullable=False),
        sa.Column("md5_hash", sa.String, nullable=False),
        sa.PrimaryKeyConstraint("annotation_id", "sequence"),
        sa.ForeignKeyConstraint(["annotation_id"], ["annotation.id"]),
    )
    op.create_table(
        "annotation_review",
        sa.Column("id", sa.Integer, Identity(always=True)),
        sa.Column("annotation_id", sa.Integer, nullable=False),
        sa.Column("resulting_annotation_id", sa.Integer, nullable=True),
        sa.Column("sequence", sa.Integer, nullable=False),
        sa.Column("author_id", sa.Integer, nullable=False),
        sa.Column("parent_task_id", sa.Integer, nullable=False),
        sa.Column("status", sa.Integer, nullable=False),
        sa.Column("result", sa.String, nullable=True),
        sa.Column("comment", sa.String, nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("annotation_id", "sequence"),
        sa.ForeignKeyConstraint(["annotation_id"], ["annotation.id"]),
        sa.ForeignKeyConstraint(["resulting_annotation_id"], ["annotation.id"]),
        sa.ForeignKeyConstraint(["author_id"], ["user.id"]),
        sa.ForeignKeyConstraint(["parent_task_id"], ["task.id"]),
    )


def setup_associations():
    op.create_table(
        "task__image_instance",
        sa.Column("task_id", sa.Integer),
        sa.Column("image_instance_id", sa.Integer),
        sa.PrimaryKeyConstraint("task_id", "image_instance_id"),
        sa.ForeignKeyConstraint(["task_id"], ["task.id"]),
        sa.ForeignKeyConstraint(["image_instance_id"], ["image_instance.id"]),
    )
    op.create_table(
        "task__label_assignment",
        sa.Column("task_id", sa.Integer),
        sa.Column("label_assignment_id", sa.Integer),
        sa.PrimaryKeyConstraint("task_id", "label_assignment_id"),
        sa.ForeignKeyConstraint(["task_id"], ["task.id"]),
        sa.ForeignKeyConstraint(["label_assignment_id"], ["label_assignment.id"]),
    )
    op.create_table(
        "task__annotation",
        sa.Column("task_id", sa.Integer),
        sa.Column("annotation_id", sa.Integer),
        sa.PrimaryKeyConstraint("task_id", "annotation_id"),
        sa.ForeignKeyConstraint(["task_id"], ["task.id"]),
        sa.ForeignKeyConstraint(["annotation_id"], ["annotation.id"]),
    )
    op.create_table(
        "user__role",
        sa.Column("user_id", sa.Integer),
        sa.Column("role_id", sa.Integer),
        sa.PrimaryKeyConstraint("user_id", "role_id"),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"]),
        sa.ForeignKeyConstraint(["role_id"], ["role.id"]),
    )
    op.create_table(
        "label__label_type",
        sa.Column("label_id", sa.Integer),
        sa.Column("label_type_id", sa.Integer),
        sa.PrimaryKeyConstraint("label_id", "label_type_id"),
        sa.ForeignKeyConstraint(["label_id"], ["label.id"]),
        sa.ForeignKeyConstraint(["label_type_id"], ["label_type.id"]),
    )


def downgrade():
    op.drop_table("label__label_type")
    op.drop_table("user__role")
    op.drop_table("task__label")
    op.drop_table("task__image_instance")

    op.drop_table("annotation_review")
    op.drop_table("annotation")
    op.drop_table("label_assignment")
    op.drop_table("task")
    op.drop_table("user")
    op.drop_table("role")
    op.drop_table("label_type")
    op.drop_table("label")
    op.drop_table("annotation_type")
    op.drop_table("image_instance_tag_value")
    op.drop_table("dicom_tag_value")
    op.drop_table("tag")
    op.drop_table("dicom")
