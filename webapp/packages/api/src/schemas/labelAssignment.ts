import { Annotation } from './annotation';
import { ImageInstance } from './imageInstance';

export interface LabelAssignment {
  id: number;
  label_id: number;
  image_instance_id: number;
  author_id: number;
  parent_task_id: number;
  annotations: Annotation[];

  // not present in api response
  imageInstance?: ImageInstance;
}

export interface LabelAssignmentsModifyApiIn {
  label_ids_to_create: number[];
  label_ids_to_remove: number[];
  image_instance_id: number;
  parent_task_id: number;
}

export type LabelAssignmentsObject = Record<number, LabelAssignment>;
