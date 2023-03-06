import React from 'react';
import ImageInstanceDownloader from '@labelstack/viewer/src/components/ImageInstanceDownloader';
import { useAnnotatorDataContext } from '../../contexts/AnnotatorDataContext';

interface AnnotatorImageInstanceDownloaderProps {
  taskId: number;
}

const AnnotatorImageInstanceDownloader: React.FC<AnnotatorImageInstanceDownloaderProps> = ({ taskId }) => {
  const [
    {
      taskObjects: { taskImageInstances }
    }
  ] = useAnnotatorDataContext();

  if (!taskImageInstances) {
    return;
  }

  return <ImageInstanceDownloader imageInstances={Object.values(taskImageInstances)} taskId={taskId} />;
};

export default AnnotatorImageInstanceDownloader;
