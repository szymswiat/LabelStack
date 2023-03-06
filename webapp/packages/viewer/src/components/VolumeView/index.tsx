import React from 'react';

import { useViewerLayoutContext } from '../../contexts/ViewerLayoutContext';
import VolumeViewVtk from '../../vtk/VolumeViewVtk';

interface VolumeViewProps {
  viewId: string;
  volumeViewType: typeof VolumeViewVtk;
}

const VolumeView: React.FC<VolumeViewProps> = ({ viewId, volumeViewType: VolumeViewVtkComponent }) => {
  const [{ activeViewId }, { setActiveViewId }] = useViewerLayoutContext();

  return (
    <div
      className={'relative w-full h-full bg-black'}
      onMouseEnter={() => setActiveViewId(viewId)}
      onMouseLeave={() => setActiveViewId(null)}
    >
      <VolumeViewVtkComponent viewId={viewId} activeViewId={activeViewId!} />
    </div>
  );
};

export default VolumeView;
