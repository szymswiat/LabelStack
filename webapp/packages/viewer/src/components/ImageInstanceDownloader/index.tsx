import React, { useEffect, useRef } from 'react';
import { ImageInstance } from '@labelstack/api';
import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';
import { db } from '../../utils';
import { useImageDataContext } from '../../contexts/ImageDataContext';
import { downloadAndCacheImageInstance } from './dicomDownloader';

interface ImageInstanceDownloaderProps {
  taskId?: number;
  imageInstances: ImageInstance[];
}

export interface ImageInstanceDownloaderApi {
  getDownloadProgress: () => number[];
}

const ImageInstanceDownloader: React.FC<ImageInstanceDownloaderProps> = ({ imageInstances, taskId }) => {
  const [{ token }] = useUserDataContext();
  const [, { notifyImageCacheUpdated, setDownloaderApi }] = useImageDataContext();

  const downloadProgress = useRef<number[]>(imageInstances.map(() => 0));

  function downloadProgressCallback(imageInstanceIndex: number) {
    return (progress: number) => {
      downloadProgress.current[imageInstanceIndex] = progress;
      notifyImageCacheUpdated();
    };
  }

  async function fetchAndCacheImageInstance(imageInstance: ImageInstance) {
    const imageInstanceIndex = imageInstances.indexOf(imageInstance);

    if (!(await db.hasImage(imageInstance))) {
      try {
        await downloadAndCacheImageInstance(token, taskId, imageInstance, downloadProgressCallback(imageInstanceIndex));
      } catch (e) {
        downloadProgress.current[imageInstanceIndex] = -1;
        notifyImageCacheUpdated();
        return;
      }
    }

    downloadProgress.current[imageInstanceIndex] = 100;
    notifyImageCacheUpdated();
  }

  useEffect(() => {
    imageInstances.forEach((imageInstance) => fetchAndCacheImageInstance(imageInstance));

    setDownloaderApi({
      getDownloadProgress: () => downloadProgress.current
    });
  }, []);

  return <></>;
};

export default ImageInstanceDownloader;
