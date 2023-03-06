import React from 'react';

import { useViewContext } from '../../contexts/consumers';
import { useImageDataContext } from '../../contexts/ImageDataContext';
import LabelMapVolumeRepresentationCompanion from './LabelMapVolumeRepresentationCompanion';
import { useEffectNonNull } from '@labelstack/app/src/utils/hooks';
import { useHookCompanion } from '../../utils/HookCompanion';
import { LabelMap } from '../../contexts/AnnotationDataContext';
import { View } from 'react-vtk-js';

export interface LabelMapVolumeRepresentationProps {
  id: string;
  opacity: number;
  inputLabelMap: LabelMap;
}

const LabelMapVolumeRepresentation: React.FC<LabelMapVolumeRepresentationProps> = (props) => {
  const view: View = useViewContext();
  const [{ imageData }] = useImageDataContext();

  const { inputLabelMap } = props;

  const hookCompanion = useHookCompanion(
    LabelMapVolumeRepresentationCompanion,
    { ...props, view, imageData }
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
      hookCompanion.setColor(inputLabelMap.color);
    },
    [inputLabelMap.color],
    [hookCompanion]
  );

  return <></>;
};

export default LabelMapVolumeRepresentation;
