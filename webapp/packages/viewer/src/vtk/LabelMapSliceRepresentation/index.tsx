import React from 'react';

import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';
import { useImagePropertiesContext } from '../../contexts/ImagePropertiesContext';
import { useViewContext } from '../../contexts/consumers';
import { useImageDataContext } from '../../contexts/ImageDataContext';
import LabelMapSliceRepresentationCompanion from './LabelMapSliceRepresentationCompanion';
import { useEffectNonNull } from '@labelstack/app/src/utils/hooks';
import SliceViewCompanion from '../SliceView/SliceViewCompanion';
import { useHookCompanion } from '../../utils/HookCompanion';
import { LabelMap } from '../../contexts/AnnotationDataContext';
import { View } from 'react-vtk-js';

export interface LabelMapSliceRepresentationProps {
  id: string;
  opacity: number;
  inputLabelMap: LabelMap;
  slicingMode: SlicingMode;
  sliceViewCompanion: SliceViewCompanion;
}

const LabelMapSliceRepresentation: React.FC<LabelMapSliceRepresentationProps> = (props) => {
  const { sliceViewCompanion, id } = props;
  const view: View = useViewContext();
  const [{ visibleSlices }] = useImagePropertiesContext();
  const [{ imageData }] = useImageDataContext();

  const { inputLabelMap, slicingMode } = props;

  const hookCompanion = useHookCompanion(
    LabelMapSliceRepresentationCompanion,
    { ...props, view, imageData },
    (companion) => {
      sliceViewCompanion.attachLabelMapRepresentation(id, companion);
    }
  );

  useEffectNonNull(
    () => {
      if (!inputLabelMap.modificationTime) {
        hookCompanion.setLabelMapData(inputLabelMap.data);
      }
      view.renderView();
    },
    [],
    [hookCompanion, inputLabelMap]
  );

  useEffectNonNull(
    () => {
      hookCompanion.setVisibility(inputLabelMap.visibility);
    },
    [inputLabelMap.visibility],
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
      hookCompanion.setSlicingMode(slicingMode);
    },
    [slicingMode],
    [hookCompanion]
  );

  useEffectNonNull(
    () => {
      hookCompanion.setColor(inputLabelMap.color);
    },
    [inputLabelMap.color],
    [hookCompanion]
  );

  return <></>;
};

export default LabelMapSliceRepresentation;
