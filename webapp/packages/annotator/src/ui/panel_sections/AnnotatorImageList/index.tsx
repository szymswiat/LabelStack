import React from 'react';
import { useAnnotatorDataContext } from '../../../contexts/AnnotatorDataContext';
import ImageList from '@labelstack/viewer/src/ui/panel_sections/ImageList';
import { ImageInstance } from '@labelstack/api';
import { useImageDataContext } from '@labelstack/viewer/src/contexts/ImageDataContext';
import { useAnnotationDataContext } from '@labelstack/viewer/src/contexts/AnnotationDataContext';
import { useNavigate } from 'react-router';
import { useEditedAnnotationDataContext } from '../../../contexts/EditedAnnotationDataContext';

export const AnnotatorImageList: React.FC = () => {
  const [
    {
      task,
      taskObjects: { taskImageInstances }
    }
  ] = useAnnotatorDataContext();
  const [{ imageInstance }] = useImageDataContext();
  const [, { setEditedLabelMapId }] = useEditedAnnotationDataContext();
  const [, { setLabelMaps }] = useAnnotationDataContext();

  const navigate = useNavigate();

  function changeImageInstance(newImageInstance: ImageInstance) {
    if (imageInstance?.id === newImageInstance.id) {
      return;
    }
    setEditedLabelMapId(null);
    setLabelMaps([]);

    navigate(`?taskId=${task.id}&imageInstanceId=${newImageInstance.id}`);
  }

  if (taskImageInstances) {
    return <ImageList imageInstances={taskImageInstances} onImageInstanceChange={changeImageInstance} />;
  }
  return <></>;
};

export default AnnotatorImageList;
