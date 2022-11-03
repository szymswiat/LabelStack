import React, { useEffect, useState } from 'react';
import PanelButton from '../../components/PanelButton';
import { BsFillFileEarmarkTextFill } from 'react-icons/bs';
import { useImageDataContext } from '../../../contexts/ImageDataContext';
import FloatingWindow from '../../components/FloatingWindow';
import { useViewerLayoutContext } from '../../../contexts/ViewerLayoutContext';

const IMAGE_DESCRIPTION_WINDOW_KEY = 'ImageDescriptionWindow';

const ImageInfo: React.FC = () => {
  const [showDescriptionWindow, setShowDescriptionWindow] = useState<boolean>(false);
  const [{ imageInstance }] = useImageDataContext();
  const [, { showFloatingWindow, hideFloatingWindow }] = useViewerLayoutContext();

  useEffect(() => {
    if (showDescriptionWindow) {
      showFloatingWindow(
        IMAGE_DESCRIPTION_WINDOW_KEY,
        <FloatingWindow
          name={'Image Description'}
          windowKey={IMAGE_DESCRIPTION_WINDOW_KEY}
          key={IMAGE_DESCRIPTION_WINDOW_KEY}
          onClose={() => setShowDescriptionWindow(false)}
        >
          <div className={'pl-2 pr-2'}>{descTagValue?.value}</div>
        </FloatingWindow>
      );
    } else {
      hideFloatingWindow(IMAGE_DESCRIPTION_WINDOW_KEY);
    }
  }, [showDescriptionWindow]);

  if (!imageInstance) {
    return <></>;
  }

  const descTagValue = imageInstance.tags.filter((tagValue) => tagValue.tag.keyword === 'SeriesDescription').at(0);

  return (
    <div className={'flex flex-row h-10'}>
      <PanelButton
        containerClassName={'w-10 h-10'}
        name={descTagValue ? 'Show Image Description' : 'No description to show'}
        isActive={showDescriptionWindow}
        icon={BsFillFileEarmarkTextFill}
        iconProps={{ size: 20 }}
        onClick={() => setShowDescriptionWindow(!showDescriptionWindow)}
        disabled={descTagValue == null}
      />
    </div>
  );
};

export default ImageInfo;
