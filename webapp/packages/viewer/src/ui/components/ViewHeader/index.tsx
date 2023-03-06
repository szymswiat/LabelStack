import React from 'react';
import { useImagePropertiesContext } from '../../../contexts/ImagePropertiesContext';
import { useImageDataContext } from '../../../contexts/ImageDataContext';
import { EditText } from 'react-edit-text';
import { showDangerNotification } from '@labelstack/app/src/utils';
import PanelButton from '../PanelButton';
import { useViewerLayoutContext } from '../../../contexts/ViewerLayoutContext';
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';
// @ts-ignore
const { SlicingMode } = vtkImageMapper;

interface PaintViewHeaderProps {
  viewId: string;
}

const slicingModeNameMapping = {
  [SlicingMode.K]: 'AXIAL',
  [SlicingMode.J]: 'CORONAL',
  [SlicingMode.I]: 'SAGITTAL'
};

const ViewHeader: React.FC<PaintViewHeaderProps> = ({ viewId }) => {
  const [{ visibleSlices }, { setVisibleSlices }] = useImagePropertiesContext();
  const [{ imageData }] = useImageDataContext();
  const [{ slicingModes }, { setSlicingModes }] = useViewerLayoutContext();

  const slicingMode = slicingModes[viewId];

  const sliceCount = imageData!.vtkImage.getDimensions()[slicingMode] - 1;
  const sliceIndex = visibleSlices[slicingMode];

  function updateVisibleSlice(sliceIndex: number) {
    if (sliceIndex < 0 || sliceIndex > sliceCount) {
      showDangerNotification('', 'Slice index invalid for current image.');
      return;
    }
    visibleSlices[slicingMode] = sliceIndex;
    setVisibleSlices([...visibleSlices]);
  }

  function changeSlicingMode() {
    const modeList = Object.keys(slicingModeNameMapping).map((k) => Number(k));
    const modeIndex = (modeList.indexOf(slicingMode) + 1) % 3;
    slicingModes[viewId] = modeList[modeIndex];
    setSlicingModes({ ...slicingModes });
  }

  return (
    <>
      <div className={'h-full w-full flex flex-row p-2 text-primary-light font-bold'}>
        <div className={'w-1/5'} />
        <div className={'w-3/5 flex flex-row place-content-center'}>
          <span>Slice:</span>
          <div className={'w-2'} />
          {/*@ts-ignore*/}
          <EditText
            className={'cursor-pointer bg-black bg-opacity-0 max-w-16 font-bold'}
            value={String(sliceIndex)}
            type={'number'}
            onChange={(value) => updateVisibleSlice(Number(value))}
          />
          <div className={'w-1'} />
          /
          <div className={'w-1'} />
          <span>{sliceCount}</span>
        </div>
        <div className={'w-1/5 flex flex-row-reverse pr-2'}>
          {sliceCount > 1 && (
            <PanelButton
              name={slicingModeNameMapping[slicingMode]}
              isActive={false}
              containerClassName={'w-24 h-full bg-secondary-dark hover:bg-primary-dark rounded-md'}
              iconClassName={'select-none'}
              onClick={changeSlicingMode}
              border={false}
              disableTooltip={true}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewHeader;
