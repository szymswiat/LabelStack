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
    if (!(await db.hasEntry(imageInstance))) {
      await db.createImageInstanceCacheEntry(imageInstance);
    }
    if (dicoms.length > 1) {
      await downloadAndCacheDicomSliceSeries(token, imageInstance, dicoms, progressCallback);
    } else {
      await downloadSingleSlice(token, imageInstance, dicoms[0], progressCallback);
    }
    const cachedDicom = await db.getDicom(dicoms[0]);
    await db.finishCaching(imageInstance, dicoms, extractDataset(cachedDicom.data));
  } else {
    throw Error('Image instance has to be associated with at least one dicom.');
  }
}

async function downloadAndCacheDicomSliceSeries(
  token: string,
  imageInstance: ImageInstance,
  dicoms: Dicom[],
  progressCallback?: DownloaderProgressEvent
) {
  const dicomsPresence = await Promise.all(dicoms.map(async (dicom) => !(await db.hasDicom(dicom))));
  dicoms = dicoms.filter((_dicom, index) => dicomsPresence[index]);

  let fetchedDicomsCount = dicomsPresence.length - dicoms.length;

  for (let index = 0; index < dicoms.length; index++) {
    const dicom = dicoms[index];
    const dicomData = await api.getDicomDataWado(token, dicom);
    await db.cacheDicom(imageInstance, dicom, dicomData);
    fetchedDicomsCount += 1;
    progressCallback?.((fetchedDicomsCount / dicomsPresence.length) * 100);
  }
}

async function downloadSingleSlice(
  token: string,
  imageInstance: ImageInstance,
  dicom: Dicom,
  progressCallback?: DownloaderProgressEvent
) {
  function progressEventCallback(event: ProgressEvent) {
    // @ts-ignore
    const total = parseFloat(event.currentTarget.getResponseHeader(['content-length']));

    progressCallback?.(Math.min(Math.floor((event.loaded / total) * 100), 100));
  }

  const dicomData = await api.getDicomDataWado(token, dicom, progressEventCallback);
  await db.cacheDicom(imageInstance, dicom, dicomData);
}

export { downloadAndCacheImageInstance };
