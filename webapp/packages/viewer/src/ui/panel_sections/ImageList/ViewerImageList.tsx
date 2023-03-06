import React from 'react';
import ImageList from '@labelstack/viewer/src/ui/panel_sections/ImageList';
import { ImageInstance } from '@labelstack/api';
import { useImageDataContext } from '@labelstack/viewer/src/contexts/ImageDataContext';
import { useNavigate } from 'react-router';
import { useViewerDataContext } from '../../../contexts/ViewerDataContext';
import { useAnnotationDataContext } from '../../../contexts/AnnotationDataContext';

export const ViewerImageList: React.FC = () => {
  const [{ viewerImageInstances }] = useViewerDataContext();
  const [{ imageInstance }] = useImageDataContext();
  const navigate = useNavigate();
  const [, { setLabelMaps }] = useAnnotationDataContext();

  function changeImageInstance(newImageInstance: ImageInstance) {
    if (imageInstance?.id === newImageInstance.id) {
      return;
    }

    const imageInstanceIds = Object.values(viewerImageInstances).map((imageInstance) => imageInstance.id);

    setLabelMaps([]);

    navigate(`?imageInstanceIds=${imageInstanceIds.join(',')}&imageInstanceId=${newImageInstance.id}`);
  }

  if (viewerImageInstances) {
    return <ImageList imageInstances={viewerImageInstances} onImageInstanceChange={changeImageInstance} />;
  }
  return <></>;
};

export default ViewerImageList;
