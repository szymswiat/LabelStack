import React, { useEffect, useRef, useState } from 'react';
import { ImageInstance } from '@labelstack/api';
import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';
import { db, delay } from '../../utils';
import { useImageDataContext } from '../../contexts/ImageDataContext';
import { downloadAndCacheImageInstance } from './dicomDownloader';
import { useLocalStorage } from '@labelstack/app/src/utils/hooks';

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
  const [updateTrigger, triggerUpdate] = useState<number>(Date.now());
  const [downloadRetryDelay, ] = useLocalStorage('downloadRetryDelay', 5000);

  const downloadProgress = useRef<number[]>(imageInstances.map(() => 0));

  function downloadProgressCallback(imageInstanceIndex: number) {
    return (progress: number) => {
      downloadProgress.current[imageInstanceIndex] = progress;
      notifyImageCacheUpdated();
    };
  }

  async function fetchAndCacheImageInstance(imageInstance: ImageInstance) {
    const imageInstanceIndex = imageInstances.indexOf(imageInstance);

    if (!(await db.hasCachedImage(imageInstance))) {
      try {
        await downloadAndCacheImageInstance(token, taskId, imageInstance, downloadProgressCallback(imageInstanceIndex));
      } catch (e) {
        console.log(e);
        downloadProgress.current[imageInstanceIndex] = -1;
        notifyImageCacheUpdated();
        return;
      }
    }

    downloadProgress.current[imageInstanceIndex] = 100;
    notifyImageCacheUpdated();
  }

  useEffect(() => {
    new Promise(async () => {
      for (const imageInstance of imageInstances) {
        await fetchAndCacheImageInstance(imageInstance);
      }

      await delay(downloadRetryDelay);
      triggerUpdate(Date.now());
    });

    setDownloaderApi({
      getDownloadProgress: () => downloadProgress.current
    });
  }, [updateTrigger]);

  return <></>;
};

export default ImageInstanceDownloader;
