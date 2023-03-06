import React, { ReactNode } from 'react';
import { useAnnotatorDataContext } from '@labelstack/annotator/src/contexts/AnnotatorDataContext';
import ViewerLayout from '@labelstack/viewer/src/ui/layouts/ViewerLayout';
import { TaskType } from '@labelstack/api';
import { uiModeAnnotationReviewTask, uiModeAnnotationTask, uiModeLabelTask } from './modes';
import Viewport from '@labelstack/viewer/src/ui/components/Viewport';
import EditableSliceView from '../../vtk/EditableSliceView';

const taskModeMappings = {
  [TaskType.labelAssignment]: uiModeLabelTask,
  [TaskType.annotation]: uiModeAnnotationTask,
  [TaskType.annotationReview]: uiModeAnnotationReviewTask
};

const AnnotatorUiTaskMode: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const [{ task }] = useAnnotatorDataContext();

  if (!task || !(task.task_type in taskModeMappings)) {
    return <div className={'bg-primary-dark w-full h-full'} />;
  }

  return (
    <ViewerLayout {...taskModeMappings[task.task_type]}>
      <Viewport sliceViewComponent={EditableSliceView} />
      {children}
    </ViewerLayout>
  );
};

export default AnnotatorUiTaskMode;
