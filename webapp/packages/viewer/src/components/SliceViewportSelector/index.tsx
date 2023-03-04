import React from 'react';
import { useViewerLayoutContext, ViewMode } from '../../contexts/ViewerLayoutContext';
import OneSliceViewport from './OneSliceViewport';
import TwoSlicesViewport from './TwoSlicesViewport';
import ThreeSlicesViewport from './ThreeSlicesViewport';

import SliceView from '../../vtk/SliceViewVtk';

const viewModeMappings = {
  [ViewMode.ONE_SLICE]: OneSliceViewport,
  [ViewMode.TWO_SLICES]: TwoSlicesViewport,
  [ViewMode.THREE_SLICES]: ThreeSlicesViewport
};

export interface SliceViewportSelectorProps {
  sliceViewType: typeof SliceView;
}

const SliceViewportSelector: React.FC<SliceViewportSelectorProps> = ({ sliceViewType }) => {
  const [{ viewMode }] = useViewerLayoutContext();

  const ViewportComponent = viewModeMappings[viewMode];

  return <ViewportComponent sliceViewType={sliceViewType} />;
};

export default SliceViewportSelector;
