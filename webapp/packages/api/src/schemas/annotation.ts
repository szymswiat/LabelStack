import { AnnotationReview } from './annotationReview';
import { LabelAssignment } from './labelAssignment';

export interface AnnotationData {
  annotation_id: number;
  sequence: number;
}

export enum AnnotationStatus {
  open = 0,
  done = 1
}

export interface Annotation {
  id: number;
  label_assignment_id: number;
  author_id: number;
  parent_task_id: number;
  version: number;
  spent_time: number;
  status: AnnotationStatus;
  reviews: AnnotationReview[];
  data_list: AnnotationData[];

  // not present in api response
  labelAssignment?: LabelAssignment;
}

export interface AnnotationType {
  id: number;
  name?: string;
}

export type AnnotationsObject = Record<number, Annotation>;
