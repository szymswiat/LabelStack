import React from 'react';
import LabelMapDrawerCompanion from '../LabelMapDrawer/LabelMapDrawerCompanion';
import { ImageData } from '@labelstack/viewer/src/contexts/ImageDataContext';
import { ViewTypes } from '@kitware/vtk.js/Widgets/Core/WidgetManager/Constants';
import { useHookCompanion } from '@labelstack/viewer/src/utils/HookCompanion';
import PolygonWidgetInstanceCompanion from './PolygonWidgetInstanceCompanion';
import { useEffectNonNull } from '@labelstack/app/src/utils/hooks';
import { useImagePropertiesContext } from '@labelstack/viewer/src/contexts/ImagePropertiesContext';
import WidgetManagerCompanion from '@labelstack/viewer/src/vtk/WidgetManager/WidgetManagerCompanion';
import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';

export interface PolygonWidgetInstanceProps {
  size: number;
  slicingMode: SlicingMode;
  widgetManager: WidgetManagerCompanion;
  labelMapDrawer: LabelMapDrawerCompanion;
  viewType: ViewTypes;
  onPaintInteractionEnd?: () => void;
  imageData: ImageData;
}

const PolygonWidgetInstance: React.FC<PolygonWidgetInstanceProps> = (props) => {
  const { onPaintInteractionEnd, labelMapDrawer, widgetManager, slicingMode } = props;
  const [{ visibleSlices }] = useImagePropertiesContext();

  const sliceIndex = visibleSlices[widgetManager.slicingMode];

  const hookCompanion = useHookCompanion(PolygonWidgetInstanceCompanion, { ...props });

  useEffectNonNull(
    () => {
      labelMapDrawer.updateWidgetOrigin(hookCompanion.widget, sliceIndex, slicingMode);
    },
    [sliceIndex, slicingMode],
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

export default PolygonWidgetInstance;
