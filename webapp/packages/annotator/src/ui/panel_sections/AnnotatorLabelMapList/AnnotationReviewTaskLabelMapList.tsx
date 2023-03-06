import React, { ReactNode, useCallback } from 'react';
import { useAnnotationDataContext } from '@labelstack/viewer/src/contexts/AnnotationDataContext';
import { LabelMapsObject } from '@labelstack/viewer/src/contexts/AnnotationDataContext/LabelMap';
import { useImageDataContext } from '@labelstack/viewer/src/contexts/ImageDataContext';
import {
  shouldShowTaskInProgressAlert,
  TaskInProgressAlert
} from '@labelstack/viewer/src/ui/panel_sections/LabelMapList/Alerts';
import { useAnnotatorDataContext } from '../../../contexts/AnnotatorDataContext';
import { AnnotationsObject } from '@labelstack/api';
import { getAnnotationsFromImageInstance } from '../../../utils';
import LabelMapList from '@labelstack/viewer/src/ui/panel_sections/LabelMapList';
import { useEditedAnnotationDataContext } from '../../../contexts/EditedAnnotationDataContext';
import AnnotationUploader from '../../../components/AnnotationUploader';

export enum LabelMapsDisplayMode {
  toCorrect,
  toReview,
  readonly
}

interface AnnotationReviewTaskLabelMapListProps {
  labelMapsDisplayMode: LabelMapsDisplayMode;
}

const AnnotationReviewTaskLabelMapList: React.FC<AnnotationReviewTaskLabelMapListProps> = ({
  labelMapsDisplayMode
}) => {
  const [{ imageInstance }] = useImageDataContext();
  const [
    {
      task,
      taskObjects: { taskReviews, taskAnnotations }
    },
    { refreshTaskObjects }
  ] = useAnnotatorDataContext();
  const [{ labelMaps }] = useAnnotationDataContext();
  const [{ editedLabelMapId }] = useEditedAnnotationDataContext();

  const getDisplayDataForMode: () => [AnnotationsObject, LabelMapsObject] = useCallback(() => {
    const annotationIdsInTask = Object.values(taskAnnotations).map((annotation) => annotation.id);
    const resultingAnnotationIds = Object.values(taskReviews)
      .map((review) => review.resulting_annotation_id)
      .filter((id) => id != null);

    const displayModeAnnotationIds = Object.keys(imageInstanceAnnotations)
      .map((id) => Number(id))
      .filter((id) => {
        switch (labelMapsDisplayMode) {
          case LabelMapsDisplayMode.toCorrect:
            return resultingAnnotationIds.includes(Number(id));
          case LabelMapsDisplayMode.toReview:
            return annotationIdsInTask.includes(Number(id));
          case LabelMapsDisplayMode.readonly:
            return !resultingAnnotationIds.includes(Number(id)) && !annotationIdsInTask.includes(Number(id));
          default:
            throw Error('Invalid display mode.');
        }
      });

    const displayModeAnnotations: AnnotationsObject = {};
    const displayModeLabelMaps: LabelMapsObject = {};

    for (const annotationId of displayModeAnnotationIds) {
      displayModeAnnotations[annotationId] = imageInstanceAnnotations[annotationId];

      for (const labelMap of Object.values(labelMaps)) {
        if (labelMap.id.annotationId === annotationId) {
          displayModeLabelMaps[labelMap.id.uniqueId] = labelMap;
        }
      }
    }
    return [displayModeAnnotations, displayModeLabelMaps];
  }, [labelMapsDisplayMode, imageInstance, taskReviews, labelMaps]);

  if (!imageInstance || !labelMaps || !taskReviews) {
    return <></>;
  }

  const imageInstanceAnnotations = getAnnotationsFromImageInstance(imageInstance);

  const [displayModeAnnotations, displayModeLabelMaps] = getDisplayDataForMode();

  function getLabelMapListComponent() {
    switch (labelMapsDisplayMode) {
      case LabelMapsDisplayMode.toCorrect:
        if (shouldShowTaskInProgressAlert(task)) {
          // TODO: show label assignments bound to task
          return <TaskInProgressAlert />;
        }
        return (
          <LabelMapList
            editable={true}
            editedLabelMapId={editedLabelMapId}
            labelMaps={displayModeLabelMaps}
            onLabelMapSaved={refreshTaskObjects}
          />
        );
      case LabelMapsDisplayMode.toReview:
        return <LabelMapList editable={false} labelMaps={displayModeLabelMaps} />;
      case LabelMapsDisplayMode.readonly:
        return <LabelMapList editable={false} labelMaps={displayModeLabelMaps} />;
    }
  }

  return (
    <>
      <AnnotationUploader annotations={displayModeAnnotations} />
      {getLabelMapListComponent()}
    </>
  );
};

export { AnnotationReviewTaskLabelMapList };
