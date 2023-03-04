import React from 'react';

import ImageInstanceLoader from '@labelstack/viewer/src/components/ImageInstanceLoader';
import { useDocumentTitle, useQuery } from '@labelstack/app/src/utils/hooks';
import { Navigate } from 'react-router-dom';
import Viewport from '../../components/Viewport';
import SliceViewVtk from '../../vtk/SliceViewVtk';

import ViewerDataLoader from '../ViewerDataLoader';
import ViewerImageInstanceDownloader from '../ImageInstanceDownloader/ViewerImageInstanceDownloader';
import ServerConnectionChecker from '../ServerConnectionChecker';
import ViewerLayout from '../ViewerLayout';
import uiModeMain from '../ViewerLayout/mainMode';

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
    <>
      <ImageInstanceLoader />
      <ViewerImageInstanceDownloader />
      <ServerConnectionChecker />
      <ViewerDataLoader imageInstanceIds={imageInstanceIds} imageInstanceId={imageInstanceId} />
      <ViewerLayout {...uiModeMain}>
        <Viewport sliceViewType={SliceViewVtk} />
      </ViewerLayout>
    </>
  );
};

export default ViewerApp;
