// @ts-ignore
import { ImageInstance } from './imageInstance';
import { LabelAssignment } from './labelAssignment';
import { Annotation } from './annotation';

export enum TaskType {
  labelAssignment = 0,
  annotation = 1,
  annotationReview = 2
}

export const taskTypeRepresentation = {
  [TaskType.labelAssignment]: 'Label Assignment',
  [TaskType.annotation]: 'Annotation',
  [TaskType.annotationReview]: 'Review'
};

export enum TaskStatus {
  unassigned = 0,
  open = 1,
  inProgress = 2,
  done = 3,
  cancelled = 4
}

export const taskStatusRepresentation = {
  [TaskStatus.unassigned]: 'Unassigned',
  [TaskStatus.open]: 'Open',
  [TaskStatus.inProgress]: 'In Progress',
  [TaskStatus.done]: 'Done',
  [TaskStatus.cancelled]: 'Cancelled'
};

export enum TaskPriority {
  low = 0,
  normal = 50,
  high = 100
}

export const taskPriorityRepresentation = {
  [TaskPriority.low]: 'Low',
  [TaskPriority.normal]: 'Normal',
  [TaskPriority.high]: 'High'
};

export interface Task {
  id?: number;
  assigned_user_id?: number;
  status: TaskStatus;
  total_time: number;
  task_type: TaskType;
  name: string;
  description: string;
  priority: number;

  image_instance_ids?: number[];
  label_assignment_ids?: number[];
  annotation_ids?: number[];
}

export interface AvailableStatusesForTaskApiOut {
  statuses: number[];
}
