import React from 'react';
import { useViewerLayoutContext } from '../../contexts/ViewerLayoutContext';

const FloatingWindowContainer: React.FC = () => {
  const [{ floatingWindows }] = useViewerLayoutContext();

  return <div className={'absolute left-0 top-0 z-50 text-dark-text'}>{Object.values(floatingWindows)}</div>;
};

export default FloatingWindowContainer;
