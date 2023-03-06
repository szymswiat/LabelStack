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
import SliceViewportSelector from '@labelstack/viewer/src/components/SliceViewportSelector';
import EditableSliceViewVtk from '../../vtk/EditableSliceViewVtk';
import { useAnnotatorDataContext } from '../../contexts/AnnotatorDataContext';
import Viewport from '@labelstack/viewer/src/components/Viewport';
import { useViewerLayoutContext } from '@labelstack/viewer/src/contexts/ViewerLayoutContext';
import { sliceViewModes, volumeViewModes } from '@labelstack/viewer/src/components/ViewerApp';
import VolumeView from '@labelstack/viewer/src/components/VolumeView';
import VolumeViewVtk from '@labelstack/viewer/src/vtk/VolumeViewVtk';

const taskModeMappings = {
  [TaskType.labelAssignment]: uiModeLabelTask,
  [TaskType.annotation]: uiModeAnnotationTask,
  [TaskType.annotationReview]: uiModeAnnotationReviewTask
};

const AnnotatorApp: React.FC = () => {
  const query = useQuery();
  const [{ task }] = useAnnotatorDataContext();
  const [{ viewMode }] = useViewerLayoutContext();

  useDocumentTitle('LabelStack - Annotator');

  if (query.has('taskId') === false) {
    return <Navigate to={'/error'} state={{ message: 'Missing taskId. Cannot launch annotator.' }} />;
  }

  const taskId = Number(query.get('taskId'));
  const imageInstanceId = Number(Number(query.get('imageInstanceId')));

  const renderLayout = task && task.task_type in taskModeMappings;

  const isSliceViewActive = sliceViewModes.includes(viewMode);
  const isVolumeViewActive = volumeViewModes.includes(viewMode);

  return (
    <>
      <ImageInstanceLoader />
      <AnnotatorImageInstanceDownloader taskId={taskId} />
      <AnnotatorDataLoader taskId={taskId} imageInstanceId={imageInstanceId} />
      <ServerConnectionChecker />
      {renderLayout && (
        <ViewerLayout {...taskModeMappings[task.task_type]}>
          <Viewport>
            {isSliceViewActive && <SliceViewportSelector sliceViewType={EditableSliceViewVtk} />}
            {isVolumeViewActive && <VolumeView volumeViewType={VolumeViewVtk} viewId={'0'} />}
          </Viewport>
        </ViewerLayout>
      )}
    </>
  );
};

export default AnnotatorApp;
