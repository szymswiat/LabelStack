import React, { useCallback } from 'react';
import { useImageDataContext } from '@labelstack/viewer/src/contexts/ImageDataContext';
import { useAnnotationDataContext } from '@labelstack/viewer/src/contexts/AnnotationDataContext';
import { LabelMapsObject } from '@labelstack/viewer/src/contexts/AnnotationDataContext/LabelMap';
import {
  shouldShowTaskInProgressAlert,
  TaskInProgressAlert
} from '@labelstack/viewer/src/ui/panel_sections/LabelMapList/Alerts';
import { LabelAssignmentList } from './LabelAssignmentList';
import { useAnnotatorDataContext } from '../../../contexts/AnnotatorDataContext';
import { AnnotationsObject } from '@labelstack/api';
import { getAnnotationsFromImageInstance } from '../../../utils';
import LabelMapList from '@labelstack/viewer/src/ui/panel_sections/LabelMapList';
import { useEditedAnnotationDataContext } from '../../../contexts/EditedAnnotationDataContext';
import AnnotationUploader from '../../../components/AnnotationUploader';

export enum LabelMapsDisplayMode {
  readonly,
  toCreate
}

interface AnnotationTaskLabelMapListProps {
  labelMapsDisplayMode: LabelMapsDisplayMode;
}

const AnnotationTaskLabelMapList: React.FC<AnnotationTaskLabelMapListProps> = ({ labelMapsDisplayMode }) => {
  const [{ imageInstance }] = useImageDataContext();
  const [{ labelMaps }] = useAnnotationDataContext();
  const [{ editedLabelMapId }] = useEditedAnnotationDataContext();
  const [
    {
      task,
      taskObjects: { taskLabelAssignments, taskAnnotations }
    },
    { refreshTaskObjects }
  ] = useAnnotatorDataContext();

  const getDisplayDataForMode: () => [AnnotationsObject, LabelMapsObject] = useCallback(() => {
    const displayModeAnnotationIds = Object.keys(imageInstanceAnnotations)
      .map((id) => Number(id))
      .filter((id) => {
        const inTask = Number(id) in taskAnnotations;
        switch (labelMapsDisplayMode) {
          case LabelMapsDisplayMode.readonly:
            return !inTask;
          case LabelMapsDisplayMode.toCreate:
            return inTask;
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
  }, [labelMapsDisplayMode, imageInstance, taskAnnotations, labelMaps]);

  if (!imageInstance || !labelMaps || !taskAnnotations) {
    return <></>;
  }

  const imageInstanceAnnotations = getAnnotationsFromImageInstance(imageInstance);

  const [displayModeAnnotations, displayModeLabelMaps] = getDisplayDataForMode();

  function getLabelMapListComponent() {
    switch (labelMapsDisplayMode) {
      case LabelMapsDisplayMode.toCreate:
        if (shouldShowTaskInProgressAlert(task)) {
          // TODO: show label assignments bound to task
          return (
            <div className={'flex flex-col gap-y-8'}>
              <TaskInProgressAlert />
              <LabelAssignmentList labelAssignments={Object.values(taskLabelAssignments)} />
            </div>
          );
        }
        return (
          <LabelMapList
            editable={true}
            labelMaps={displayModeLabelMaps}
            editedLabelMapId={editedLabelMapId}
            onLabelMapSaved={refreshTaskObjects}
          />
        );
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

export { AnnotationTaskLabelMapList };
