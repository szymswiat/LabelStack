import { Annotation, ImageInstance, AnnotationReviewsObject, AnnotationsObject } from '@labelstack/api';

export function getResultingAnnotationsFromReviews(taskReviews: AnnotationReviewsObject): AnnotationsObject {
  return Object.fromEntries(
    Object.values(taskReviews)
      .map((review) => review.resultingAnnotation)
      .filter((annotation) => annotation)
      .map((annotation) => [annotation.id, annotation])
  );
}

export function getAnnotationsFromImageInstance(imageInstance: ImageInstance): AnnotationsObject {
  const annotations: Annotation[] = [];
  imageInstance.label_assignments.forEach((labelAssignment) => {
    labelAssignment.annotations.forEach((annotation) => {
      annotations.push(annotation);
    });
  });
  return Object.fromEntries(annotations.map((annotation) => [annotation.id, annotation]));
}
