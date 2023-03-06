import React from 'react';

import { useEffectNonNull } from '@labelstack/app/src/utils/hooks';
import { useViewContext } from '@labelstack/viewer/src/contexts/consumers';
import { useAnnotatorToolsContext } from '../../contexts/AnnotatorToolsContext';
import { ManipulatorOptions, ModifierOptions } from '@labelstack/viewer/src/types/vtkjs.ext';
import { useHookCompanion } from '@labelstack/viewer/src/utils/HookCompanion';
import ToolSizeManipulatorCompanion from './ToolSizeManipulator';

export interface ToolSizeManipulatorProps {
  manipulatorOptions: ManipulatorOptions & ModifierOptions;
  minToolSize: number;
  maxToolSize: number;
}

const ToolSizeManipulator: React.FC<ToolSizeManipulatorProps> = (props) => {
  const view = useViewContext();
  const [{ toolSize }, { setToolSize }] = useAnnotatorToolsContext();

  const hookCompanion = useHookCompanion(ToolSizeManipulatorCompanion, { ...props, view });

  useEffectNonNull(
    () => {
      hookCompanion.setToolSize = setToolSize;
      hookCompanion.getToolSize = () => toolSize;
    },
    [toolSize, setToolSize],
    [hookCompanion]
  );

  return <></>;
};

export default ToolSizeManipulator;
