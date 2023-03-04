import React from 'react';

import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';
import { useViewerLayoutContext } from '../../contexts/ViewerLayoutContext';
import ViewHeader from '../ViewHeader';
import SliceViewVtk from '../../vtk/SliceViewVtk';

interface SliceViewProps {
  viewId: string;
  slicingMode: SlicingMode;
  sliceViewType: typeof SliceViewVtk;
}

const SliceView: React.FC<SliceViewProps> = ({ viewId, slicingMode, sliceViewType: SliceViewVtkComponent }) => {
  const [{ activeViewId }, { setActiveViewId }] = useViewerLayoutContext();

  return (
    <div
      className={'relative w-full h-full bg-black'}
      onMouseEnter={() => setActiveViewId(viewId)}
      onMouseLeave={() => setActiveViewId(null)}
    >
      <div className={'absolute top-0 left-0 h-10 w-full mt-2 z-10'}>
        <ViewHeader viewId={viewId} />
      </div>
      <div className={'h-full w-full z-0'}>
        <SliceViewVtkComponent viewId={viewId} activeViewId={activeViewId!} slicingMode={slicingMode} />
      </div>
    </div>
  );
};

export default SliceView;
