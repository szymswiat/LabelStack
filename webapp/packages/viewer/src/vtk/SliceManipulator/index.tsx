import React from 'react';

import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';
import { ManipulatorOptions, ModifierOptions } from '../../types/vtkjs.ext';
import SliceManipulatorCompanion from './SliceManipulatorCompanion';
import { useImagePropertiesContext } from '../../contexts/ImagePropertiesContext';
import { useImageDataContext } from '../../contexts/ImageDataContext';
import { useEffectNonNull } from '@labelstack/app/src/utils/hooks';
import { useViewContext } from '../../contexts/consumers';
import { useHookCompanion } from '../../utils/HookCompanion';

export interface SliceManipulatorProps {
  manipulatorOptions: ManipulatorOptions & ModifierOptions;
  manipulatorOptionsSecond?: ManipulatorOptions & ModifierOptions;
  slicingMode: SlicingMode;
}

const SliceManipulator: React.FC<SliceManipulatorProps> = (props) => {
  const view = useViewContext();
  const [{ imageData }] = useImageDataContext();
  const [imagePropertiesState, imagePropertiesApi] = useImagePropertiesContext();

  const hookCompanion = useHookCompanion(SliceManipulatorCompanion, { ...props, view, imageData }, (companion) => {
    companion.setImagePropertiesContext(imagePropertiesState, imagePropertiesApi);
  });

  useEffectNonNull(
    () => {
      hookCompanion.setImagePropertiesContext(imagePropertiesState, imagePropertiesApi);
    },
    [imagePropertiesState, imagePropertiesApi],
    [hookCompanion]
  );

  return <></>;
};

export default SliceManipulator;
