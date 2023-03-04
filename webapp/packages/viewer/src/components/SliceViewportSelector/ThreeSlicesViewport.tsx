import React, { useEffect } from 'react';
import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';

import SliceView from '../SliceView';
import { SliceViewportSelectorProps } from '../../components/SliceViewportSelector';
import { useViewerLayoutContext } from '../../contexts/ViewerLayoutContext';
import { useLocalStorage } from '@labelstack/app/src/utils/hooks';

const ThreeSlicesViewport: React.FC<SliceViewportSelectorProps> = ({ sliceViewType }) => {
  const [{ slicingModes }, { setSlicingModes }] = useViewerLayoutContext();

  const [slicingModesStorage, setSlicingModesStorage] = useLocalStorage<Record<string, SlicingMode>>(
    'threeSlicesSlicingModes',
    { '0': SlicingMode.K, '1': SlicingMode.I, '2': SlicingMode.J }
  );

  const slicingModesCount = Object.keys(slicingModes).length;

  useEffect(() => {
    if (slicingModesCount !== 3) {
      setSlicingModes(slicingModesStorage);
    } else {
      setSlicingModesStorage(slicingModes);
    }
  }, [slicingModes]);

  if (slicingModesCount !== 3) {
    return <></>;
  }

  return (
    <div className={'flex flex-row divide-x h-full'}>
      <div className={'w-1/2 h-full flex flex-col divide-y'}>
        <div className={'h-1/2 w-full'}>
          <SliceView viewId={'0'} slicingMode={slicingModes['0']} sliceViewType={sliceViewType} />
        </div>
        <div className={'h-1/2 w-full'}>
          <SliceView viewId={'1'} slicingMode={slicingModes['1']} sliceViewType={sliceViewType} />
        </div>
      </div>
      <div className={'w-1/2 h-full'}>
        <SliceView viewId={'2'} slicingMode={slicingModes['2']} sliceViewType={sliceViewType} />
      </div>
    </div>
  );
};

export default ThreeSlicesViewport;
