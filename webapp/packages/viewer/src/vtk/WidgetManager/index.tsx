import React from 'react';
import { useHookCompanion } from '../../utils/HookCompanion';
import WidgetManagerCompanion from './WidgetManagerCompanion';
import { useViewContext } from '../../contexts/consumers';
import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';
import { useEffectNonNull } from '@labelstack/app/src/utils/hooks';

export interface WidgetManagerProps {
  slicingMode: SlicingMode;
  onMount: (widgetManager: WidgetManagerCompanion) => void;
}

const WidgetManager: React.FC<WidgetManagerProps> = (props) => {
  const { slicingMode, onMount } = props;
  const view = useViewContext();

  const hookCompanion = useHookCompanion(WidgetManagerCompanion, { ...props, view });

  useEffectNonNull(
    () => {
      onMount(hookCompanion);
    },
    [],
    [hookCompanion]
  );

  useEffectNonNull(
    () => {
      hookCompanion.setSlicingMode(slicingMode);
    },
    [slicingMode],
    [hookCompanion]
  );

  return <></>;
};

export default WidgetManager;
