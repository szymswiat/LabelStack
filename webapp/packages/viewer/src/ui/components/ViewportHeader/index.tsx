import React from 'react';
import { useImagePropertiesContext } from '../../../contexts/ImagePropertiesContext';
import { EditText } from 'react-edit-text';
import { useImageDataContext } from '../../../contexts/ImageDataContext';
import { showDangerNotification } from '@labelstack/app/src/utils';

const ViewportHeader: React.FC = () => {
  const [{ windowWidth, windowCenter }, { setWindowCenterWidth }] = useImagePropertiesContext();
  const [
    {
      imageData: { dataset }
    }
  ] = useImageDataContext();

  const minImageValue = dataset.WindowCenter - dataset.WindowWidth / 2;
  const maxImageValue = dataset.WindowCenter + dataset.WindowWidth / 2;

  function setWindowCenter(center: number) {
    if (center < minImageValue || center > maxImageValue) {
      showDangerNotification('', 'Invalid window center value for current image.');
      return;
    }
    setWindowCenterWidth(center, windowWidth);
  }

  function setWindowWidth(width: number) {
    if (width < 0 || width > dataset.WindowWidth) {
      showDangerNotification('', 'Invalid window width value for current image.');
      return;
    }
    setWindowCenterWidth(windowCenter, width);
  }

  return (
    <div className={'h-full w-full flex flex-row p-2 flex place-content-center text-dark-text font-bold'}>
      <span>W/L:</span>
      <div className={'w-2'} />
      {/*@ts-ignore*/}
      <EditText
        className={'cursor-pointer bg-black bg-opacity-0 max-w-16 font-bold'}
        value={`${windowWidth}`}
        type={'number'}
        onChange={(value) => setWindowWidth(Number(value))}
      />
      <div className={'w-1'} />
      /
      <div className={'w-1'} />
      {/*@ts-ignore*/}
      <EditText
        className={'cursor-pointer bg-black bg-opacity-0 max-w-16 font-bold'}
        value={`${windowCenter}`}
        type={'number'}
        onChange={(value) => setWindowCenter(Number(value))}
      />
    </div>
  );
};

export default ViewportHeader;
