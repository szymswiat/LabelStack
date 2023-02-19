import React, { useRef } from 'react';
import { useAnnotatorDataContext } from '@labelstack/annotator/src/contexts/AnnotatorDataContext';
import { useImageDataContext } from '@labelstack/viewer/src/contexts/ImageDataContext';
import { LabelMap, useAnnotationDataContext } from '@labelstack/viewer/src/contexts/AnnotationDataContext';
import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';
import { Annotation, api } from '@labelstack/api';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import { AnnotationReviewsObject, AnnotationsObject, LabelAssignmentsObject } from '@labelstack/api';
import { LabelMapId, LabelMapsObject } from '@labelstack/viewer/src/contexts/AnnotationDataContext/LabelMap';
import { getResultingAnnotationsFromReviews } from '@labelstack/annotator/src/utils';
import { buildLabelMap, decodeLabelMap } from '@labelstack/viewer/src/utils/labelMapUtils';
import { useEffectNonNull } from '@labelstack/app/src/utils/hooks';

const AnnotationReviewTaskDataLoader: React.FC = () => {
  const [
    {
      task,
      allLabels,
      taskObjects: { taskReviews, taskAnnotations },
      updateTriggers: { taskObjectsTrigger }
    },
    { setTaskLabelAssignments, setTaskAnnotations, setTaskReviews }
  ] = useAnnotatorDataContext();
  const [{ imageInstance, imageData }] = useImageDataContext();
  const [{ labelMaps }, { setLabelMaps }] = useAnnotationDataContext();
  const [{ token }] = useUserDataContext();
  const prevImageInstanceId = useRef<number | null>(null);

  async function buildTaskObjects() {
    const { data: reviewData } = await api.readAnnotationReviews(token, task);

    const taskLabelAssignments: LabelAssignmentsObject = {};
    const taskAnnotations: AnnotationsObject = {};
    const taskReviews: AnnotationReviewsObject = {};

    imageInstance.label_assignments.forEach((labelAssignment) => {
      labelAssignment.imageInstance = imageInstance;
      labelAssignment.annotations.forEach((annotation) => {
        annotation.labelAssignment = labelAssignment;
        if (task.annotation_ids.includes(annotation.id)) {
          taskLabelAssignments[labelAssignment.id] = labelAssignment;
          taskAnnotations[annotation.id] = annotation;
        }
        reviewData.forEach((review) => {
          if (review.annotation_id === annotation.id) {
            review.annotation = annotation;
            taskReviews[review.id] = review;
          }
          if (review.resulting_annotation_id === annotation.id) {
            review.resultingAnnotation = annotation;
          }
        });
      });
    });

    setTaskLabelAssignments(taskLabelAssignments);
    setTaskAnnotations(taskAnnotations);
    setTaskReviews(taskReviews);
  }

  async function loadAnnotationReviewData() {
    if (!imageInstance || !task || !taskAnnotations) {
      return;
    }
    const resultingAnnotations = getResultingAnnotationsFromReviews(taskReviews);

    const imageInstanceAnnotations: Annotation[] = [];
    imageInstance.label_assignments.forEach((labelAssignment) => {
      if (labelAssignment.annotations?.length > 0) {
        if (labelAssignment.annotations.at(-1).id in resultingAnnotations) {
          imageInstanceAnnotations.push(labelAssignment.annotations.at(-2));
        } else {
          imageInstanceAnnotations.push(labelAssignment.annotations.at(-1));
        }
      }
    });

    let newLabelMaps: LabelMapsObject = prevImageInstanceId.current === imageInstance.id ? labelMaps : {};

    const annotationsToDisplay = imageInstanceAnnotations.concat(Object.values(resultingAnnotations));
    const annotationIdsToDisplay = annotationsToDisplay.map((annotation) => annotation.id);

    for (const labelMap of Object.values(newLabelMaps)) {
      if (!annotationIdsToDisplay.includes(labelMap.id.annotationId) && labelMap.id.sequence == null) {
        delete newLabelMaps[labelMap.id.uniqueId];
      }
    }

    for (const annotation of annotationsToDisplay) {
      if (!annotation) {
        continue;
      }

      const label = allLabels[annotation.labelAssignment.label_id];
      const editable = annotation.id in resultingAnnotations;
      const annotationData = annotation?.data_list.at(-1);

      let newLabelMapId;
      if (annotation.id in resultingAnnotations) {
        newLabelMapId = LabelMapId.create(annotation.id);
      } else {
        newLabelMapId = LabelMapId.create(annotation.id, annotationData?.sequence);
      }
      if (newLabelMapId.uniqueId in labelMaps) {
        continue;
      }

      let labelMapData: vtkImageData;
      if (annotationData) {
        const { data: encodedLabelMap } = await api.readAnnotationData(token, annotation, annotationData.sequence);
        labelMapData = await decodeLabelMap(imageData.vtkImage, encodedLabelMap);
      } else {
        labelMapData = await buildLabelMap(imageData.vtkImage);
      }

      const labelMapToDisplay: LabelMap = {
        id: newLabelMapId,
        name: label.name,
        color: [Math.random(), Math.random(), Math.random()],
        data: labelMapData,
        visibility: editable,
        editable: editable,
        modificationTime: 0
      };

      newLabelMaps[labelMapToDisplay.id.uniqueId] = labelMapToDisplay;
    }

    // copy data from reviewed annotation to resulting one
    Object.values(taskReviews)
      .filter((review) => review.resultingAnnotation != null && review.resultingAnnotation.data_list?.length === 0)
      .forEach((review) => {
        const resultingLabelMapId = LabelMapId.create(review.resulting_annotation_id).uniqueId;
        const reviewedLabelMapId = LabelMapId.create(
          review.annotation_id,
          review.annotation.data_list.length - 1
        ).uniqueId;

        newLabelMaps[resultingLabelMapId].data = newLabelMaps[reviewedLabelMapId].data;
      });

    setLabelMaps(Object.values(newLabelMaps));
    prevImageInstanceId.current = imageInstance.id;
  }

  useEffectNonNull(
    () => {
      loadAnnotationReviewData();
    },
    [],
    [allLabels, taskReviews, imageData]
  );

  useEffectNonNull(
    () => {
      buildTaskObjects();
    },
    [taskObjectsTrigger],
    [imageInstance]
  );

  return <></>;
};

export default AnnotationReviewTaskDataLoader;
