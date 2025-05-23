import React, { useCallback } from 'react';
import { useImageDataContext } from '@labelstack/viewer/src/contexts/ImageDataContext';
import { useAnnotationDataContext } from '@labelstack/viewer/src/contexts/AnnotationDataContext';
import { LabelMap, LabelMapsObject } from '@labelstack/viewer/src/contexts/AnnotationDataContext/LabelMap';
import {
  shouldShowTaskInProgressAlert,
  TaskInProgressAlert
} from '@labelstack/viewer/src/ui/panel_sections/LabelMapList/Alerts';
import { LabelAssignmentList } from './LabelAssignmentList';
import { useAnnotatorDataContext } from '../../../contexts/AnnotatorDataContext';
import { AnnotationsObject, api, LabelAssignment } from '@labelstack/api';
import { getAnnotationsFromImageInstance } from '../../../utils';
import LabelMapList from '@labelstack/viewer/src/ui/panel_sections/LabelMapList';
import { useEditedAnnotationDataContext } from '../../../contexts/EditedAnnotationDataContext';
import AnnotationUploader from '../../../components/AnnotationUploader';
import { useAnnotatorLayoutContext } from '../../../contexts/AnnotatorLayoutContext';
import CreateLabelAssignmentBar from './CreateLabelAssignmentBar';
import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';

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
  const [{ editedLabelMapId }, { setEditedLabelMapId, triggerAnnotationsUpload }] = useEditedAnnotationDataContext();
  const [{ editModeLocked }] = useAnnotatorLayoutContext();
  const [
    {
      task,
      taskObjects: { taskLabelAssignments, taskAnnotations }
    },
    { refreshTaskObjects }
  ] = useAnnotatorDataContext();
  const [{ token }] = useUserDataContext();

  async function dropLabelAssignment(labelMap: LabelMap) {
    await api.modifyLabelAssignments(token, [], [labelMap.annotation.labelAssignment.label_id], imageInstance, task);
    if (editedLabelMapId == labelMap.id.uniqueId) {
      setEditedLabelMapId(null);
    }
    refreshTaskObjects();
  }

  function canDropLabelMap(labelMap: LabelMap) {
    const labelAssignmentParentTaskId = labelMap.annotation.labelAssignment.parent_task_id;
    return labelAssignmentParentTaskId === task.id;
  }

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
          return (
            <div className={'flex flex-col gap-y-8'}>
              <TaskInProgressAlert />
              <LabelAssignmentList labelAssignments={Object.values(taskLabelAssignments)} />
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-y-4">
            <LabelMapList
              editable={true}
              labelMaps={displayModeLabelMaps}
              editedLabelMapId={editedLabelMapId}
              onLabelMapSaved={triggerAnnotationsUpload}
              setEditedLabelMapId={setEditedLabelMapId}
              disableTools={editModeLocked}
              onLabelMapRemoved={dropLabelAssignment}
              canDropLabelMap={canDropLabelMap}
            />
            {!editModeLocked && <CreateLabelAssignmentBar />}
          </div>
        );
      case LabelMapsDisplayMode.readonly:
        return <LabelMapList editable={false} labelMaps={displayModeLabelMaps} />;
    }
  }

  return (
    <>
      {labelMapsDisplayMode == LabelMapsDisplayMode.toCreate && (
        <AnnotationUploader annotations={displayModeAnnotations} />
      )}
      {getLabelMapListComponent()}
    </>
  );
};

export { AnnotationTaskLabelMapList };
