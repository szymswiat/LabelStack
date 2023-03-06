import React from 'react';
import { useViewerLayoutContext } from '../../contexts/ViewerLayoutContext';

const OverlayWindowContainer: React.FC = () => {
  const [{ overlayWindow }] = useViewerLayoutContext();

  if (!overlayWindow) {
    return <></>;
  }

  return (
    <div className={'absolute w-screen h-screen left-0 top-0 bg-black bg-opacity-80 z-50 grid'}>{overlayWindow}</div>
  );
};

export default OverlayWindowContainer;
