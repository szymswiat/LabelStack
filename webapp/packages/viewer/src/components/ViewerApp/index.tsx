import React from 'react';

import ImageInstanceLoader from '@labelstack/viewer/src/components/ImageInstanceLoader';
import { useDocumentTitle, useQuery } from '@labelstack/app/src/utils/hooks';
import { Navigate } from 'react-router-dom';
import SliceViewportSelector from '../../components/SliceViewportSelector';
import SliceViewVtk from '../../vtk/SliceViewVtk';

import ViewerDataLoader from '../ViewerDataLoader';
import ViewerImageInstanceDownloader from '../ImageInstanceDownloader/ViewerImageInstanceDownloader';
import ServerConnectionChecker from '../ServerConnectionChecker';
import ViewerLayout from '../ViewerLayout';
import uiModeMain from '../ViewerLayout/mainMode';
import Viewport from '../Viewport';
import { useViewerLayoutContext, ViewMode } from '../../contexts/ViewerLayoutContext';
import VolumeView from '../VolumeView';
import VolumeViewVtk from '../../vtk/VolumeViewVtk';

export const sliceViewModes = [ViewMode.ONE_SLICE, ViewMode.TWO_SLICES, ViewMode.THREE_SLICES];
export const volumeViewModes = [ViewMode.VOLUME];

const ViewerApp: React.FC = () => {
  const query = useQuery();

  const [{ viewMode }] = useViewerLayoutContext();

  useDocumentTitle('LabelStack - Viewer');

  if (query.has('imageInstanceIds') === false) {
    return <Navigate to={'/error'} state={{ message: 'Missing imageInstanceIds. Cannot launch viewer.' }} />;
  }

  const imageInstanceIds = query
    .get('imageInstanceIds')
    .split(',')
    .map((idStr) => Number(idStr));

  const imageInstanceId = Number(query.get('imageInstanceId'));

  const isSliceViewActive = sliceViewModes.includes(viewMode);
  const isVolumeViewActive = volumeViewModes.includes(viewMode);

  return (
    <>
      <ImageInstanceLoader />
      <ViewerImageInstanceDownloader />
      <ViewerDataLoader imageInstanceIds={imageInstanceIds} imageInstanceId={imageInstanceId} />
      <ServerConnectionChecker />
      <ViewerLayout {...uiModeMain}>
        <Viewport>
          {isSliceViewActive && <SliceViewportSelector sliceViewType={SliceViewVtk} />}
          {isVolumeViewActive && <VolumeView volumeViewType={VolumeViewVtk} viewId={'0'} />}
        </Viewport>
      </ViewerLayout>
    </>
  );
};

export default ViewerApp;
