import React from 'react';
import { useImageDataContext } from '../../../contexts/ImageDataContext';
import ViewportHeader from '../ViewportHeader';
import { useViewerLayoutContext, ViewMode } from '../../../contexts/ViewerLayoutContext';
import { OneSliceViewport, ThreeSlicesViewport, TwoSlicesViewport } from '../../../viewport_modes';
import SliceView from '../../../vtk/SliceView';
import Window from '../Window';

const viewModeMappings = {
  [ViewMode.ONE_SLICE]: OneSliceViewport,
  [ViewMode.TWO_SLICES]: TwoSlicesViewport,
  [ViewMode.THREE_SLICES]: ThreeSlicesViewport
};

export interface ViewportProps {
  sliceViewComponent: typeof SliceView;
}

const Viewport: React.FC<ViewportProps> = ({ sliceViewComponent }) => {
  const [{ imageData }] = useImageDataContext();
  const [{ viewMode }] = useViewerLayoutContext();

  const ViewportComponent = viewModeMappings[viewMode];

  return (
    <Window className={'bg-black h-full p-1'}>
      {imageData && viewMode != null && (
        <div className={'relative w-full h-full'}>
          <div className={'absolute top-0 left-0 h-10 mt-2 pl-2 z-20'}>
            <ViewportHeader />
          </div>
          <div className={'h-full z-0'}>
            <ViewportComponent sliceViewComponent={sliceViewComponent} />
          </div>
        </div>
      )}
    </Window>
  );
};

export default Viewport;
