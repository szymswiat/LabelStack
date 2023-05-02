from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    endpoint_login,
    endpoint_users,
    endpoint_dicoms,
    endpoint_labels,
    endpoint_label_assignments,
    endpoint_label_types,
    endpoint_tasks,
    endpoint_annotations,
    endpoint_annotation_data,
    endpoint_annotation_reviews,
    endpoint_roles,
    endpoint_annotation_types,
    endpoint_image_instances,
    endpoint_auth,
)

api_router = APIRouter()
api_router.include_router(endpoint_login.router, tags=["login"])
api_router.include_router(endpoint_users.router, prefix="/users", tags=["users"])

api_router.include_router(endpoint_dicoms.router, prefix="/dicoms", tags=["dicoms"])
api_router.include_router(
    endpoint_image_instances.router, prefix="/image_instances", tags=["image_instances"]
)
api_router.include_router(endpoint_labels.router, prefix="/labels", tags=["labels"])
api_router.include_router(
    endpoint_label_assignments.router,
    prefix="/label_assignments",
    tags=["label_assignments"],
)
api_router.include_router(
    endpoint_annotation_types.router,
    prefix="/annotation_types",
    tags=["annotation_types"],
)
api_router.include_router(endpoint_annotations.router, prefix="/annotations", tags=["annotations"])
api_router.include_router(
    endpoint_annotation_data.router, prefix="/annotation_data", tags=["annotation_data"]
)
api_router.include_router(
    endpoint_annotation_reviews.router,
    prefix="/annotation_reviews",
    tags=["annotation_reviews"],
)
api_router.include_router(endpoint_label_types.router, prefix="/label_types", tags=["label_types"])
api_router.include_router(endpoint_roles.router, prefix="/roles", tags=["roles"])
api_router.include_router(endpoint_tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(endpoint_auth.router, prefix="/auth", tags=["auth"])
