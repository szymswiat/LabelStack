import React from 'react';
import { useImagePropertiesContext } from '../../../contexts/ImagePropertiesContext';
import { BsCircleHalf } from 'react-icons/bs';
import { useViewerSettingsContext } from '../../../contexts/ViewerSettingsContext';
import { useHotkeys } from 'react-hotkeys-hook';
import TopBarButton from '../../components/TopBarButton';

interface ImagePropertiesOptionsProps {}

const ImagePropertiesOptions: React.FC<ImagePropertiesOptionsProps> = () => {
  const [{ invertColors }, { setInvertColors }] = useImagePropertiesContext();
  const [{ invertColorsHotkeys }] = useViewerSettingsContext();

  useHotkeys(invertColorsHotkeys.join(','), () => setInvertColors(!invertColors), [invertColors]);

  return (
    <div className={'flex flex-row gap-x-2'}>
      <TopBarButton
        name={'Invert colors'}
        isActive={invertColors}
        onClick={() => setInvertColors(!invertColors)}
        icon={BsCircleHalf}
        iconProps={{ size: 20 }}
      />
    </div>
  );
};

export default ImagePropertiesOptions;
