import React from 'react';
import { useViewerDataContext } from '../../contexts/ViewerDataContext';
import ImageInstanceDownloader from './index';

const ViewerImageInstanceDownloader: React.FC = () => {
  const [{ viewerImageInstances }] = useViewerDataContext();

  if (!viewerImageInstances) {
    return <></>;
  }

  return <ImageInstanceDownloader imageInstances={Object.values(viewerImageInstances)} />;
};

export default ViewerImageInstanceDownloader;
