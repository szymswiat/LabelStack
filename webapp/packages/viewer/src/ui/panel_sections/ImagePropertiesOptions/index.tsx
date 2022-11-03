import React from 'react';
import PanelButton from '../../components/PanelButton';
import { useImagePropertiesContext } from '../../../contexts/ImagePropertiesContext';
import { BsCircleHalf } from 'react-icons/bs';
import { useViewerSettingsContext } from '../../../contexts/ViewerSettingsContext';
import { useHotkeys } from 'react-hotkeys-hook';

interface ImagePropertiesOptionsProps {}

const ImagePropertiesOptions: React.FC<ImagePropertiesOptionsProps> = () => {
  const [{ invertColors }, { setInvertColors }] = useImagePropertiesContext();
  const [{ invertColorsHotkeys }] = useViewerSettingsContext();

  useHotkeys(invertColorsHotkeys.join(','), () => setInvertColors(!invertColors), [invertColors]);

  return (
    <div className={'flex flex-row gap-x-2'}>
      <PanelButton
        name={'Invert colors'}
        containerClassName={'w-10 h-10'}
        isActive={invertColors}
        onClick={() => setInvertColors(!invertColors)}
        icon={BsCircleHalf}
        iconProps={{ size: 20 }}
      />
    </div>
  );
};

export default ImagePropertiesOptions;
