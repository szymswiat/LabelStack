import React, { useEffect } from 'react';
import vtkImageMapper, { SlicingMode as SlicingModeT } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';

import SliceViewComponent from '../../components/SliceViewComponent';
import { ViewportProps } from '../../components/Viewport';
import { useViewerLayoutContext } from '../../contexts/ViewerLayoutContext';
import { useLocalStorage } from '@labelstack/app/src/utils/hooks';

// @ts-ignore
const { SlicingMode } = vtkImageMapper;

const TwoSlicesViewport: React.FC<ViewportProps> = ({ sliceViewComponent }) => {
  const [{ slicingModes }, { setSlicingModes }] = useViewerLayoutContext();
  const [slicingModesStorage, setSlicingModesStorage] = useLocalStorage<Record<string, SlicingModeT>>(
    'twoSlicesSlicingModes',
    { '0': SlicingMode.K, '1': SlicingMode.J }
  );

  const slicingModesCount = Object.keys(slicingModes).length;

  useEffect(() => {
    if (slicingModesCount !== 2) {
      setSlicingModes(slicingModesStorage);
    } else {
      setSlicingModesStorage(slicingModes);
    }
  }, [slicingModes]);

  if (slicingModesCount !== 2) {
    return <></>;
  }

  return (
    <div className={'flex flex-row divide-x h-full'}>
      <div className={'w-1/2 h-full'}>
        <SliceViewComponent viewId={'0'} slicingMode={slicingModes['0']} viewComponent={sliceViewComponent} />
      </div>
      <div className={'w-1/2 h-full'}>
        <SliceViewComponent viewId={'1'} slicingMode={slicingModes['1']} viewComponent={sliceViewComponent} />
      </div>
    </div>
  );
};

export default TwoSlicesViewport;
