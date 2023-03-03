import React from 'react';

import ImageInstanceLoader from '@labelstack/viewer/src/components/ImageInstanceLoader';
import AnnotatorDataLoader from '../AnnotatorDataLoader';
import { useDocumentTitle, useQuery } from '@labelstack/app/src/utils/hooks';
import { Navigate } from 'react-router-dom';
import AnnotatorImageInstanceDownloader from '../AnnotatorImageInstanceDownloader';
import ServerConnectionChecker from '@labelstack/viewer/src/components/ServerConnectionChecker';
import { TaskType } from '@labelstack/api';
import uiModeLabelTask from '../AnnotatorApp/labelTaskMode';
import uiModeAnnotationTask from './annotationTaskMode';
import uiModeAnnotationReviewTask from './annotationReviewTaskMode';
import ViewerLayout from '@labelstack/viewer/src/components/ViewerLayout';
import Viewport from '@labelstack/viewer/src/components/Viewport';
import EditableSliceView from '../../vtk/EditableSliceView';
import { useAnnotatorDataContext } from '../../contexts/AnnotatorDataContext';

const taskModeMappings = {
  [TaskType.labelAssignment]: uiModeLabelTask,
  [TaskType.annotation]: uiModeAnnotationTask,
  [TaskType.annotationReview]: uiModeAnnotationReviewTask
};

const AnnotatorApp: React.FC = () => {
  const query = useQuery();
  const [{ task }] = useAnnotatorDataContext();

  useDocumentTitle('LabelStack - Annotator');

  if (query.has('taskId') === false) {
    return <Navigate to={'/error'} state={{ message: 'Missing taskId. Cannot launch annotator.' }} />;
  }

  const taskId = Number(query.get('taskId'));
  const imageInstanceId = Number(Number(query.get('imageInstanceId')));

  const renderLayout = task && task.task_type in taskModeMappings;

  return (
    <>
      <ImageInstanceLoader />
      <AnnotatorDataLoader taskId={taskId} imageInstanceId={imageInstanceId} />
      <AnnotatorImageInstanceDownloader taskId={taskId} />
      <ServerConnectionChecker />
      {renderLayout && (
        <ViewerLayout {...taskModeMappings[task.task_type]}>
          <Viewport sliceViewComponent={EditableSliceView} />
        </ViewerLayout>
      )}
    </>
  );
};

export default AnnotatorApp;
