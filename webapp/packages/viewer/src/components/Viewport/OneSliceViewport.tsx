import React, { useEffect } from 'react';
import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';

import { ViewportProps } from '.';
import SliceView from '../SliceView';
import { useViewerLayoutContext } from '../../contexts/ViewerLayoutContext';
import { useLocalStorage } from '@labelstack/app/src/utils/hooks';

const OneSliceViewport: React.FC<ViewportProps> = ({ sliceViewType }) => {
  const [{ slicingModes }, { setSlicingModes }] = useViewerLayoutContext();
  const [slicingModesStorage, setSlicingModesStorage] = useLocalStorage<Record<string, SlicingMode>>(
    'oneSliceSlicingModes',
    { '0': SlicingMode.K }
  );

  const slicingModesCount = Object.keys(slicingModes).length;

  useEffect(() => {
    if (slicingModesCount !== 1) {
      setSlicingModes(slicingModesStorage);
    } else {
      setSlicingModesStorage(slicingModes);
    }
  }, [slicingModes]);

  if (slicingModesCount !== 1) {
    return <></>;
  }

  return <SliceView viewId={'0'} slicingMode={slicingModes['0']} sliceViewType={sliceViewType} />;
};

export default OneSliceViewport;
