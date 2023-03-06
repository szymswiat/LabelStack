import React from 'react';

import { ManipulatorOptions, ModifierOptions } from '../../types/vtkjs.ext';
import { useViewContext } from '../../contexts/consumers';
import { useImageDataContext } from '../../contexts/ImageDataContext';
import { useImagePropertiesContext } from '../../contexts/ImagePropertiesContext';
import { useEffectNonNull } from '@labelstack/app/src/utils/hooks';
import WindowLevelManipulatorCompanion from './WindowLevelManipulatorCompanion';
import { useHookCompanion } from '../../utils/HookCompanion';

export interface WindowLevelManipulatorProps {
  manipulatorOptions: ManipulatorOptions & ModifierOptions;
}

const WindowLevelManipulator: React.FC<WindowLevelManipulatorProps> = (props) => {
  const view = useViewContext();
  const [{ imageData }] = useImageDataContext();
  const [imagePropertiesState, imagePropertiesApi] = useImagePropertiesContext();

  const hookCompanion = useHookCompanion(
    WindowLevelManipulatorCompanion,
    { ...props, view, imageData },
    (companion) => {
      companion.setImagePropertiesContext(imagePropertiesState, imagePropertiesApi);
    }
  );

  useEffectNonNull(
    () => {
      hookCompanion.setImagePropertiesContext(imagePropertiesState, imagePropertiesApi);
    },
    [imagePropertiesState, imagePropertiesApi],
    [hookCompanion]
  );

  return <></>;
};

export default WindowLevelManipulator;
