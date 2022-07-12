import React from 'react';

import ImageInstanceLoader from '@labelstack/viewer/src/components/ImageInstanceLoader';
import { useDocumentTitle, useQuery } from '@labelstack/app/src/utils/hooks';
import { Navigate } from 'react-router-dom';
import Viewport from '../../ui/components/Viewport';
import SliceView from '../../vtk/SliceView';

import ViewerDataLoader from '../ViewerDataLoader';
import ViewerImageInstanceDownloader from '../ImageInstanceDownloader/ViewerImageInstanceDownloader';
import ServerConnectionChecker from '../ServerConnectionChecker';
import ViewerUi from '../ViewerUi';

const ViewerApp: React.FC = () => {
  const query = useQuery();

  useDocumentTitle('LabelStack - Viewer');

  if (query.has('imageInstanceIds') === false) {
    return <Navigate to={'/error'} state={{ message: 'Missing imageInstanceIds. Cannot launch viewer.' }} />;
  }

  const imageInstanceIds = query
    .get('imageInstanceIds')
    .split(',')
    .map((idStr) => Number(idStr));

  const imageInstanceId = Number(query.get('imageInstanceId'));

  return (
    <ViewerUi>
      <ImageInstanceLoader />
      <ViewerImageInstanceDownloader />
      <ServerConnectionChecker />
      <ViewerDataLoader imageInstanceIds={imageInstanceIds} imageInstanceId={imageInstanceId} />
      <Viewport sliceViewComponent={SliceView} />
    </ViewerUi>
  );
};

export default ViewerApp;
