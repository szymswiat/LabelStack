import { api, Dicom, ImageInstance } from '@labelstack/api';
import { db } from '../../utils';
import dcmjs from 'dcmjs';

type DownloaderProgressEvent = (progress: number) => void;

function extractDataset(imageData: ArrayBuffer) {
  const dicomData = dcmjs.data.DicomMessage.readFile(imageData);
  const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.dict);
  dataset._meta = dcmjs.data.DicomMetaDictionary.namifyDataset(dicomData.meta);

  return dataset;
}

async function downloadAndCacheImageInstance(
  token: string,
  taskId: number,
  imageInstance: ImageInstance,
  progressCallback?: DownloaderProgressEvent
) {
  const { data: dicoms } = await api.getDicomsForImageInstance(token, imageInstance.id, taskId);

  if (dicoms.length > 0) {
    const imageDataList = await downloadDicomSliceSeries(token, dicoms, progressCallback);
    await db.cacheImage(imageInstance, imageDataList, extractDataset(imageDataList[0]));
  } else {
    throw Error('Image instance has to be associated with at least one dicom.');
  }
}

async function downloadDicomSliceSeries(
  token: string,
  dicoms: Dicom[],
  progressCallback?: DownloaderProgressEvent
): Promise<ArrayBuffer[]> {
  const progressArray = dicoms.map((d) => 0);

  function progressEventCallback(dicomIndex: number) {
    return (event: ProgressEvent) => {
      // @ts-ignore
      const total = parseFloat(event.currentTarget.getResponseHeader(['content-length']));

      progressArray[dicomIndex] = Math.floor((event.loaded / total) * 100);
      updateProgress();
    };
  }

  function updateProgress() {
    progressCallback?.(Math.floor(progressArray.reduce((a, b) => a + b, 0) / progressArray.length));
  }

  return Promise.all(
    dicoms.map((dicom, index) => {
      return api.getDicomDataWado(token, dicom, progressEventCallback(index));
    })
  );
}

export { downloadAndCacheImageInstance };
