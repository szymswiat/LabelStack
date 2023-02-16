import React, { useEffect, useRef } from 'react';

import { useImagePropertiesContext } from '../../contexts/ImagePropertiesContext';
import { ImageInstance } from '@labelstack/api';
import { useImageDataContext } from '../../contexts/ImageDataContext';
import { db } from '../../utils';
import { readImageDICOMArrayBufferSeries, WorkerPool } from 'itk-wasm';
import ITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';

const ImageInstanceLoader: React.FC = () => {
  const [{ imageInstance, imageCacheUpdateTrigger }, { setImageData }] = useImageDataContext();
  const [, { setWindowCenterWidth, setVisibleSlices }] = useImagePropertiesContext();

  const workerPool = useRef<WorkerPool>(null);
  const mostRecentImageInstance = useRef<ImageInstance>(null);
  const loadedImageInstance = useRef<ImageInstance>(null);
  const processedImageInstance = useRef<ImageInstance>(null);

  mostRecentImageInstance.current = imageInstance;

  async function loadCachedImage() {
    if (!imageInstance) {
      return;
    }

    if (!(await db.hasCachedImage(imageInstance))) {
      return;
    }

    if (loadedImageInstance.current?.id === imageInstance?.id) {
      return;
    }

    if (processedImageInstance.current != null && processedImageInstance.current?.id === imageInstance?.id) {
      return;
    }
    processedImageInstance.current = imageInstance;

    if (workerPool.current) {
      workerPool.current.terminateWorkers();
    }

    let { imageData, dataset } = await db.getImage(imageInstance);

    const { image, webWorkerPool } = await readImageDICOMArrayBufferSeries(imageData, false);
    webWorkerPool.terminateWorkers();
    workerPool.current = webWorkerPool;

    const vtkImage = ITKHelper.convertItkToVtkImage(image) as vtkImageData;

    if (mostRecentImageInstance.current.id !== imageInstance.id) {
      return;
    }
    loadedImageInstance.current = imageInstance;

    setImageData({
      vtkImage,
      dataset
    });
    setWindowCenterWidth(dataset.WindowCenter, dataset.WindowWidth);

    const dimensions = vtkImage.getDimensions();
    setVisibleSlices(dimensions.map((v) => Math.floor(v / 2)));
  }

  useEffect(() => {
    loadCachedImage();
  }, [imageInstance?.id, imageCacheUpdateTrigger]);

  return <></>;
};

export default ImageInstanceLoader;
