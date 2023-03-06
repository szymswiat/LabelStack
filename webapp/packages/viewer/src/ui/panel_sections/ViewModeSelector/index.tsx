import React from 'react';
import { useViewerLayoutContext, ViewMode } from '../../../contexts/ViewerLayoutContext';
import { IconType } from 'react-icons';
import { BsApp, BsLayoutSplit, BsLayoutThreeColumns } from 'react-icons/bs';
import PanelButton from '../../components/PanelButton';
import { useImageDataContext } from '../../../contexts/ImageDataContext';
import { useEffectNonNull, useLocalStorage } from '@labelstack/app/src/utils/hooks';

interface ViewModeSelectorProps {}

const viewModeData: { [K in ViewMode]: [string, IconType] } = {
  [ViewMode.ONE_SLICE]: ['One slice', BsApp],
  [ViewMode.TWO_SLICES]: ['Two slices', BsLayoutSplit],
  [ViewMode.THREE_SLICES]: ['Three slices', BsLayoutThreeColumns]
};

const ViewModeSelector: React.FC<ViewModeSelectorProps> = () => {
  const [{ viewMode }, { setViewMode }] = useViewerLayoutContext();
  const [{ imageData }] = useImageDataContext();

  const [viewModeStorage, setViewModeStorage] = useLocalStorage<ViewMode>('activeViewMode3D', ViewMode.THREE_SLICES);

  const imageDimensions = imageData?.vtkImage.getDimensions();

  useEffectNonNull(
    () => {
      if (imageDimensions.at(-1) === 1) {
        setViewMode(ViewMode.ONE_SLICE);
      } else {
        setViewMode(viewModeStorage);
      }
    },
    [],
    [imageData]
  );

  useEffectNonNull(
    () => {
      if (imageDimensions.at(-1) !== 1) {
        setViewModeStorage(viewMode);
      }
    },
    [],
    [viewMode, imageData]
  );

  return (
    <div className={'flex flex-row gap-x-2'}>
      {Object.entries(viewModeData).map(([viewModeIter, [name, icon]]) => {
        const viewModeToRender = Number(viewModeIter);
        return (
          <PanelButton
            key={viewModeIter}
            name={name}
            containerClassName={'w-10 h-10'}
            isActive={viewModeToRender === viewMode}
            onClick={() => setViewMode(viewModeToRender)}
            icon={icon}
            iconProps={{ size: 20 }}
            disabled={!imageData || (viewModeToRender !== ViewMode.ONE_SLICE && imageDimensions.at(-1) === 1)}
          />
        );
      })}
    </div>
  );
};

export default ViewModeSelector;
