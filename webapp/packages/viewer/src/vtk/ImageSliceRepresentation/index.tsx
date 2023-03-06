import * as React from 'react';

import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import { useImagePropertiesContext } from '../../contexts/ImagePropertiesContext';
import { useViewContext } from '../../contexts/consumers';
import { ImageData } from '../../contexts/ImageDataContext';
import ImageSliceRepresentationCompanion from './ImageSliceRepresentationCompanion';
import { useEffectNonNull } from '@labelstack/app/src/utils/hooks';
import { useHookCompanion } from '../../utils/HookCompanion';

export interface ImageSliceRepresentationProps {
  imageData: ImageData;
  slicingMode: SlicingMode;
}

const ImageSliceRepresentation: React.FC<ImageSliceRepresentationProps> = ({ imageData, slicingMode }) => {
  const view = useViewContext();
  const [{ windowWidth, windowCenter, visibleSlices, invertColors }] = useImagePropertiesContext();

  const hookCompanion = useHookCompanion(ImageSliceRepresentationCompanion, { imageData, slicingMode, view });

  useEffectNonNull(
    () => {
      hookCompanion.updateWindowWidthCenter(windowWidth, windowCenter, invertColors);
    },
    [windowCenter, windowWidth, invertColors],
    [hookCompanion]
  );

  useEffectNonNull(
    () => {
      hookCompanion.updateVisibleSlice(visibleSlices[slicingMode]);
    },
    [visibleSlices, slicingMode],
    [hookCompanion]
  );

  useEffectNonNull(
    () => {
      hookCompanion.attachImageData(imageData);
    },
    [imageData],
    [hookCompanion]
  );

  useEffectNonNull(
    () => {
      hookCompanion.setSlicingMode(slicingMode);
      hookCompanion.centerCamera();
    },
    [slicingMode],
    [hookCompanion]
  );

  return <></>;
};

export default ImageSliceRepresentation;
