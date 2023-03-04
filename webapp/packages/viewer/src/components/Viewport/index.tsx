import React from 'react';
import { useImageDataContext } from '../../contexts/ImageDataContext';
import ViewportHeader from '../ViewportHeader';
import { useViewerLayoutContext } from '../../contexts/ViewerLayoutContext';

import Window from '../../ui/components/Window';

export interface ViewportProps {
  children: React.ReactNode;
}

const Viewport: React.FC<ViewportProps> = ({ children }) => {
  const [{ imageData }] = useImageDataContext();
  const [{ viewMode }] = useViewerLayoutContext();

  return (
    <Window className={'bg-black h-full p-1'}>
      {imageData && viewMode != null && (
        <div className={'relative w-full h-full'}>
          <div className={'absolute top-0 left-0 h-10 mt-2 pl-2 z-20'}>
            <ViewportHeader />
          </div>
          <div className={'h-full z-0'}>{children}</div>
        </div>
      )}
    </Window>
  );
};

export default Viewport;
