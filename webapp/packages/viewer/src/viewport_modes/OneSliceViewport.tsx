import React, { useEffect } from 'react';
import vtkImageMapper, { SlicingMode as SlicingModeT } from '@kitware/vtk.js/Rendering/Core/ImageMapper';

import { ViewportProps } from '../ui/components/Viewport';
import SliceViewComponent from '../components/SliceViewComponent';
import { useViewerLayoutContext } from '../contexts/ViewerLayoutContext';
import { useLocalStorage } from '@labelstack/app/src/utils/hooks';

// @ts-ignore
const { SlicingMode } = vtkImageMapper;

const OneSliceViewport: React.FC<ViewportProps> = ({ sliceViewComponent }) => {
  const [{ slicingModes }, { setSlicingModes }] = useViewerLayoutContext();
  const [slicingModesStorage, setSlicingModesStorage] = useLocalStorage<Record<string, SlicingModeT>>(
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

  return <SliceViewComponent viewId={'0'} slicingMode={slicingModes['0']} viewComponent={sliceViewComponent} />;
};

export default OneSliceViewport;
