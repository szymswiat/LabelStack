import React, { createContext, ReactNode, useContext, useState } from 'react';

import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import { ImageInstance } from '@labelstack/api/src/schemas/imageInstance';
import { ImageInstanceDownloaderApi } from '../../components/ImageInstanceDownloader';

export interface ImageData {
  vtkImage: vtkImageData;
  // naturalized data (dcmjs)
  dataset: any;
}

export interface ImageDataState {
  imageInstance: ImageInstance | null;
  imageData: ImageData | null;

  imageCacheUpdateTrigger: number;
}

export interface ImageDataApi {
  setImageInstance: (imageInstance: ImageInstance, clearPixelData?: boolean) => void;
  setImageData: (imageData: ImageData) => void;
  notifyImageCacheUpdated: () => void;

  downloaderApi: ImageInstanceDownloaderApi;
  setDownloaderApi: (api: ImageInstanceDownloaderApi) => void;
}

export type ImageDataContextType = [ImageDataState, ImageDataApi];

export const ImageDataContext = createContext<ImageDataContextType>(null);

export const useImageDataContext = () => useContext(ImageDataContext);

export const ImageDataContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [imageInstance, setImageInstanceState] = useState<ImageInstance | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [imageCacheUpdateTrigger, setImageCacheUpdateTrigger] = useState<number>(0);
  const [downloaderApi, setDownloaderApi] = useState<ImageInstanceDownloaderApi>(null);

  const state: ImageDataState = {
    imageInstance,
    imageData,
    imageCacheUpdateTrigger
  };

  function setImageInstance(imageInstance: ImageInstance, clearPixelData = true) {
    if (clearPixelData) {
      setImageData(null);
    }
    setImageInstanceState(imageInstance);
  }

  function notifyImageCacheUpdated() {
    setImageCacheUpdateTrigger(Date.now());
  }

  const api: ImageDataApi = {
    setImageInstance,
    setImageData,
    notifyImageCacheUpdated,
    downloaderApi,
    setDownloaderApi
  };

  return <ImageDataContext.Provider value={[state, api]}>{children}</ImageDataContext.Provider>;
};
