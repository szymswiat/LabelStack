import { Annotation } from './annotation';

export enum AnnotationReviewStatus {
  open = 0,
  done = 1
}

export enum AnnotationReviewResult {
  accepted = 'accepted',
  denied = 'denied',
  deniedCorrected = 'denied_corrected'
}

export interface AnnotationReview {
  id: number;

  annotation_id: number;
  sequence: number;

  resulting_annotation_id?: number;

  author_id: number;
  parent_task_id: number;
  status: AnnotationReviewStatus;
  result?: AnnotationReviewResult;
  comment?: string;

  // not present in api response
  annotation?: Annotation;
  resultingAnnotation?: Annotation;
}

export type AnnotationReviewsObject = Record<number, AnnotationReview>;
