import React from 'react';
import { useImageDataContext } from '../../../contexts/ImageDataContext';
import classNames from 'classnames';
import { getTagStringRepresentation, ImageInstance, ImageInstancesObject } from '@labelstack/api';
import { useHotkeys } from 'react-hotkeys-hook';
import { useViewerSettingsContext } from '../../../contexts/ViewerSettingsContext';
import { BsExclamationLg, BsFillImageFill, BsServer } from 'react-icons/bs';
import PanelButton from '../../components/PanelButton';
import { CircularProgressbar } from 'react-circular-progressbar';
import Tooltip from '../../components/Tooltip';
import Divider from '../../components/Divider';

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
      component = (
        <PanelButton
          name={'Cached'}
          isActive={false}
          icon={BsServer}
          iconClassName="text-dark-accent"
          border={false}
          fullSize={true}
        />
      );
    } else if (progress == null) {
      component = <></>;
    } else if (progress >= 0) {
      component = (
        <Tooltip tooltipText={'Downloading ...'}>
          <CircularProgressbar value={progress} className={'bg-dark-bg'} />
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
          fullSize={true}
        />
      );
    }

    return <div className={'w-6 h-6 place-self-center'}>{component}</div>;
  }

  return (
    <div className={'flex flex-col gap-y-4'}>
      <div className={'flex flex-row'}>
        <PanelButton
          name={'Images'}
          isActive={false}
          icon={BsFillImageFill}
          iconClassName="text-dark-accent w-4 h-4"
          containerClassName="w-6 h-6"
          border={false}
          fullSize={false}
        />
        <div className={'text-base flex flex-row'}>
          {imageInstanceList.indexOf(imageInstance) + 1}/{imageInstanceList.length}
        </div>
        <PanelButton
          name={'Download status'}
          isActive={false}
          icon={BsServer}
          iconClassName="text-dark-accent"
          containerClassName="w-6 h-6 cursor-default ml-2"
          border={false}
          fullSize={false}
        />
        <div className={'text-base'}>
          {downloadProgress?.filter((x) => x === 100).length}/{imageInstanceList.length}
        </div>
        <div className={'flex-grow'} />
      </div>
      <div className={'h-100 overflow-y-scroll no-scrollbar'}>
        <div className={'w-full h-fit flex flex-col text-dark-text gap-y-[0.3rem]'}>
          {imageInstanceList.map((imageInstanceIter, index) => {
            return (
              <div
                key={imageInstanceIter.id}
                className={classNames(
                  'flex flex-row w-full h-7 px-2 cursor-pointer bg-dark-bg rounded-sm',
                  imageInstance != null && imageInstanceIter.id === imageInstance.id ? 'opacity-100' : 'opacity-50'
                )}
                onClick={() => onImageInstanceChange(imageInstanceIter)}
              >
                <div className={'flex flex-col w-4/5 justify-center pl-2'}>
                  <div className={'text-sm grid grid-cols-3 gap-x-2'}>
                    <span className="place-self-start">{imageInstanceIter.id}</span>
                    <span className="place-self-start">
                      {getTagStringRepresentation(imageInstanceIter, 'PatientID')}
                    </span>
                    <span className="place-self-end">
                      {getTagStringRepresentation(imageInstanceIter, 'Modality')}
                    </span>
                  </div>
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
