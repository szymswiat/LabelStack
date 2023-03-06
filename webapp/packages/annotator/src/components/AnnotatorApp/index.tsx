import React from 'react';

import ImageInstanceLoader from '@labelstack/viewer/src/components/ImageInstanceLoader';
import AnnotatorDataLoader from '../AnnotatorDataLoader';
import { useDocumentTitle, useQuery } from '@labelstack/app/src/utils/hooks';
import { Navigate } from 'react-router-dom';
import AnnotatorUiTaskMode from '../AnnotatorUiTaskMode';
import AnnotatorImageInstanceDownloader from '../AnnotatorImageInstanceDownloader';
import ServerConnectionChecker from '@labelstack/viewer/src/components/ServerConnectionChecker';

const AnnotatorApp: React.FC = () => {
  const query = useQuery();

  useDocumentTitle('LabelStack - Annotator');

  if (query.has('taskId') === false) {
    return <Navigate to={'/error'} state={{ message: 'Missing taskId. Cannot launch annotator.' }} />;
  }

  const taskId = Number(query.get('taskId'));
  const imageInstanceId = Number(Number(query.get('imageInstanceId')));

  return (
    <>
      <AnnotatorDataLoader taskId={taskId} imageInstanceId={imageInstanceId} />
      <AnnotatorImageInstanceDownloader taskId={taskId} />
      <ServerConnectionChecker />
      <AnnotatorUiTaskMode>
        <ImageInstanceLoader />
      </AnnotatorUiTaskMode>
    </>
  );
};

export default AnnotatorApp;
