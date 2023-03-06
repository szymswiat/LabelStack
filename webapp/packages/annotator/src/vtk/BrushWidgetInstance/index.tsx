import React from 'react';
import LabelMapDrawerCompanion from '../LabelMapDrawer/LabelMapDrawerCompanion';
import { ViewTypes } from '@kitware/vtk.js/Widgets/Core/WidgetManager/Constants.js';
import { useHookCompanion } from '@labelstack/viewer/src/utils/HookCompanion';
import BrushWidgetInstanceCompanion from './BrushWidgetInstanceCompanion';
import { useEffectNonNull } from '@labelstack/app/src/utils/hooks';
import { useImagePropertiesContext } from '@labelstack/viewer/src/contexts/ImagePropertiesContext';
import { useAnnotatorToolsContext } from '../../contexts/AnnotatorToolsContext';
import WidgetManagerCompanion from '@labelstack/viewer/src/vtk/WidgetManager/WidgetManagerCompanion';
import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import { useViewContext } from '@labelstack/viewer/src/contexts/consumers';
import { View } from 'react-vtk-js';

export interface BrushWidgetInstanceProps {
  size: number;
  slicingMode: SlicingMode | null;
  widgetManager: WidgetManagerCompanion;
  labelMapDrawer: LabelMapDrawerCompanion;
  viewType: ViewTypes;
  onPaintInteractionEnd?: () => void;
}

const BrushWidgetInstance: React.FC<BrushWidgetInstanceProps> = (props) => {
  const { onPaintInteractionEnd, labelMapDrawer, slicingMode } = props;
  const view = useViewContext() as View;
  const [{ visibleSlices }] = useImagePropertiesContext();
  const [{ toolSize }] = useAnnotatorToolsContext();

  const sliceIndex = visibleSlices[labelMapDrawer.slicingMode];

  const hookCompanion = useHookCompanion(BrushWidgetInstanceCompanion, { ...props, view });

  useEffectNonNull(
    () => {
      labelMapDrawer.updateWidgetOrigin(hookCompanion.widget, sliceIndex, slicingMode);
    },
    [sliceIndex, slicingMode],
    [hookCompanion]
  );

  useEffectNonNull(
    () => {
      hookCompanion.setWidgetSize(toolSize);
    },
    [toolSize],
    [hookCompanion]
  );

  useEffectNonNull(
    () => {
      hookCompanion.onPaintInteractionEnd = onPaintInteractionEnd;
    },
    [onPaintInteractionEnd],
    [hookCompanion]
  );

  return <></>;
};

export default BrushWidgetInstance;
