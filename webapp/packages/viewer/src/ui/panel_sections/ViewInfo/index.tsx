import React from 'react';
import { useImagePropertiesContext } from '../../../contexts/ImagePropertiesContext';
import { useViewerLayoutContext } from '../../../contexts/ViewerLayoutContext';

interface ViewInfoProps {}

const ViewInfo: React.FC<ViewInfoProps> = () => {
  const [{ windowWidth, windowCenter }] = useImagePropertiesContext();
  const [{ activeViewId }] = useViewerLayoutContext();

  return (
    <div className={'h-full w-full grid grid-cols-6 p-2 text-primary-light'}>
      <span className={'col-start-1 col-span-3'}>Active view:</span>
      <span className={'col-start-4 whitespace-pre'}>{activeViewId}</span>

      <span className={'col-start-1 col-span-3'}>Window center:</span>
      <span className={'col-start-4 whitespace-pre'}>{windowCenter}</span>

      <span className={'col-start-1 col-span-3'}>Window width:</span>
      <span className={'col-start-4 whitespace-pre'}>{windowWidth}</span>
    </div>
  );
};

export default ViewInfo;
