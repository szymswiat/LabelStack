import * as React from 'react';

import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';
import { useImagePropertiesContext } from '../../contexts/ImagePropertiesContext';
import { useViewContext } from '../../contexts/consumers';
import { ImageData } from '../../contexts/ImageDataContext';
import ImageVolumeRepresentationCompanion from './ImageVolumeRepresentationCompanion';
import { useEffectNonNull } from '@labelstack/app/src/utils/hooks';
import { useHookCompanion } from '../../utils/HookCompanion';

export interface ImageVolumeRepresentationProps {
  imageData: ImageData;
}

const ImageVolumeRepresentation: React.FC<ImageVolumeRepresentationProps> = ({ imageData }) => {
  const view = useViewContext();
  const [{ windowWidth, windowCenter, invertColors }] = useImagePropertiesContext();

  const hookCompanion = useHookCompanion(ImageVolumeRepresentationCompanion, { imageData, view });

  useEffectNonNull(
    () => {
      hookCompanion.attachImageData(imageData);
    },
    [imageData],
    [hookCompanion]
  );

  useEffectNonNull(
    () => {
      hookCompanion.updateVisibilityByWindowLevel(windowWidth, windowCenter);
    },
    [windowCenter, windowWidth],
    [hookCompanion]
  );

  return <></>;
};

export default ImageVolumeRepresentation;
