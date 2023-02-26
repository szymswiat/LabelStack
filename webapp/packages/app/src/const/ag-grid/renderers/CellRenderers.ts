import {
  Annotation,
  AnnotationReview,
  AnnotationType,
  User,
  Label,
  LabelAssignment,
  LabelType,
  taskPriorityRepresentation,
  TaskStatus,
  taskStatusRepresentation,
  TaskType,
  taskTypeRepresentation
} from '@labelstack/api';
import { ImageInstanceTagValue } from '@labelstack/api/src/schemas/tag';
import { ICellRendererParams } from 'ag-grid-community';

export const dicomIsLabeledCellRenderer = (params: ICellRendererParams) => {
  const isLabeled = params.value as boolean;
  return isLabeled.toString();
};

export const labelAllowedAnnotationTypesCellRenderer = (params: ICellRendererParams) => {
  const allowedAnnotationType = params.value as AnnotationType;
  if (allowedAnnotationType && allowedAnnotationType.name) return allowedAnnotationType.name;
  return '';
};

export const labelTypesCellRenderer = (params: ICellRendererParams) => {
  const types = params.value as LabelType[];

  if (types) {
    const typeNames: string[] = [];
    types.forEach((type) => {
      if (type.name) typeNames.push(type.name);
    });

    return typeNames.join(', ');
  }
  return '';
};

export function imageInstanceTagRenderer(tagKeyword: string): (params: ICellRendererParams) => string {
  return (params: ICellRendererParams) => {
    const tags = params.value as ImageInstanceTagValue[];
    if (tags) {
      const tag = tags.find((tag) => tag.tag.keyword === tagKeyword);
      if (tag) {
        return tag.value;
      }
    }
    return '';
  }
}

export const taskTypeCellRenderer = (params: ICellRendererParams) => {
  const taskType = params.value as TaskType;

  if (taskType != null) {
    return taskTypeRepresentation[taskType];
  }
  return '';
};

export const taskStatusCellRenderer = (params: ICellRendererParams) => {
  const taskStatus = params.value as TaskStatus;

  if (taskStatus != null) {
    return taskStatusRepresentation[taskStatus];
  }
  return '';
};

export const labelAssignmentsCellRenderer = (params: ICellRendererParams) => {
  const labelAssignments = params.value as LabelAssignment[];

  if (labelAssignments != null && labelAssignments.length > 0) {
    const labelAssignmentsIds = labelAssignments.map((labelAssignment) => labelAssignment.id);

    return labelAssignmentsIds.join(', ');
  }
  return '';
};

export interface UserCellRendererParams extends ICellRendererParams {
  users: User[];
}

export const userCellRenderer = (params: UserCellRendererParams) => {
  const userId = params.value as number;

  if (userId != null) {
    const user = params.users.find((user) => user.id == userId);
    return user ? user.email : 'Unknown';
  }

  return '-';
};

export interface LabelCellRendererParams extends ICellRendererParams {
  labels: Label[];
}

export const labelCellRenderer = (params: LabelCellRendererParams) => {
  const labelId = params.value as number;

  if (labelId != null) {
    const label = params.labels.find((label) => label.id == labelId);
    return label ? label.name : '';
  }
  return '';
};

export const annotationsCellRenderer = (params: ICellRendererParams) => {
  const annotations = params.value as Annotation[];

  if (annotations != null) {
    const annotationsIds = annotations.map((annotation) => annotation.id);
    return annotationsIds.join(', ');
  }
  return '';
};

export const annotationReviewsCellRenderer = (params: ICellRendererParams) => {
  const annotationReviews = params.value as AnnotationReview[];

  if (annotationReviews != null) {
    const annotationReviewsIds = annotationReviews.map((annotationReview) => annotationReview.id);
    return annotationReviewsIds.join(', ');
  }
  return '';
};

export const taskPriorityCellRenderer = (params: ICellRendererParams) => {
  const priorityValue = params.value as number;

  if (priorityValue != null) {
    return taskPriorityRepresentation[priorityValue];
  }
  return '';
};
