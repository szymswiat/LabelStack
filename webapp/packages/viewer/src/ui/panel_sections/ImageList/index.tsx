import React from 'react';
import { useImageDataContext } from '../../../contexts/ImageDataContext';
import classNames from 'classnames';
import { ImageInstance, ImageInstancesObject } from '@labelstack/api';
import { useHotkeys } from 'react-hotkeys-hook';
import { useViewerSettingsContext } from '../../../contexts/ViewerSettingsContext';
import { BsExclamationLg, BsServer } from 'react-icons/bs';
import PanelButton from '../../components/PanelButton';
import { CircularProgressbar } from 'react-circular-progressbar';
import Tooltip from '../../components/Tooltip';

interface ImageListProps {
  imageInstances: ImageInstancesObject;
  onImageInstanceChange: (newImageInstance: ImageInstance) => void;
}

const ImageList: React.FC<ImageListProps> = ({ imageInstances, onImageInstanceChange }) => {
  const [{ imageInstance }, { downloaderApi }] = useImageDataContext();
  const [{ prevImageHotkeys, nextImageHotkeys }] = useViewerSettingsContext();

  const imageInstanceList = Object.values(imageInstances);

  function getNextImageInstance(direction: number) {
    const currentIdx = imageInstanceList.indexOf(imageInstance);
    let nextIdx = currentIdx + direction;
    if (nextIdx < 0) {
      nextIdx = imageInstanceList.length - 1;
    } else if (nextIdx >= imageInstanceList.length) {
      nextIdx = 0;
    }
    return imageInstanceList[nextIdx];
  }

  useHotkeys(
    prevImageHotkeys.join(','),
    () => {
      onImageInstanceChange(getNextImageInstance(-1));
    },
    [imageInstance]
  );

  useHotkeys(
    nextImageHotkeys.join(','),
    () => {
      onImageInstanceChange(getNextImageInstance(1));
    },
    [imageInstance]
  );

  const downloadProgress = downloaderApi?.getDownloadProgress();

  function renderDownloadIndicator(imageInstanceIndex: number) {
    const progress = downloadProgress?.at(imageInstanceIndex);

    let component: React.ReactNode;
    if (progress === 100) {
      component = <PanelButton name={'Cached'} isActive={false} icon={BsServer} border={false} />;
    } else if (progress == null) {
      component = <></>;
    } else if (progress >= 0) {
      component = (
        <Tooltip tooltipText={'Downloading ...'}>
          <CircularProgressbar value={progress} className={'bg-primary-dark'} />
        </Tooltip>
      );
    } else {
      component = (
        <PanelButton
          iconClassName={'text-amber-500'}
          name={'Download error'}
          isActive={false}
          icon={BsExclamationLg}
          border={false}
        />
      );
    }

    return <div className={'w-6 h-6 place-self-center'}>{component}</div>;
  }

  return (
    <div className={'flex flex-col gap-y-4'}>
      <div className={'flex flex-row px-1'}>
        <div className={'font-bold text-xl'}>
          Image: {imageInstanceList.indexOf(imageInstance) + 1}/{imageInstanceList.length}
        </div>
        <div className={'flex-grow'} />
        <div className={'font-bold text-xl'}>
          Cached: {downloadProgress?.filter((x) => x === 100).length}/{imageInstanceList.length}
        </div>
      </div>
      <div className={'h-100 overflow-auto no-scrollbar'}>
        <div className={'w-full h-full flex flex-col text-primary-light gap-y-1'}>
          {imageInstanceList.map((imageInstanceIter, index) => {
            return (
              <div
                key={imageInstanceIter.id}
                className={classNames(
                  'flex flex-row w-full h-10 pl-2 pr-2 cursor-pointer bg-primary-dark rounded-md',
                  imageInstance != null && imageInstanceIter.id === imageInstance.id ? 'opacity-100' : 'opacity-50'
                )}
                onClick={() => onImageInstanceChange(imageInstanceIter)}
              >
                <div className={'flex flex-col justify-center pl-4'}>
                  <div className={'text-xl'}>{imageInstanceIter.id}</div>
                </div>
                <div className={'flex flex-grow'} />
                {renderDownloadIndicator(index)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ImageList;
