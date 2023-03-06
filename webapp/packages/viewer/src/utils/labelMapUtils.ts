import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import { Zstd } from 'numcodecs';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';

// @ts-ignore
const codec = new Zstd();

export async function encodeLabelMap(data: vtkImageData) {
  return (await codec.encode(data.getPointData().getScalars().getData())) as Uint8Array;
}

export async function decodeLabelMap(relatedImage: vtkImageData, data: ArrayBuffer) {
  const labelMapData = vtkImageData.newInstance();
  labelMapData.shallowCopy(relatedImage);

  const decodedData: Uint8Array = await codec.decode(data);

  let dataArrayVtk = vtkDataArray.newInstance({
    values: decodedData
  });

  labelMapData.getPointData().setScalars(dataArrayVtk);

  return labelMapData;
}

export function buildLabelMap(relatedImage: vtkImageData) {
  const labelMapData = vtkImageData.newInstance();
  labelMapData.shallowCopy(relatedImage);

  const dataArrayVtk = vtkDataArray.newInstance({
    values: new Uint8Array(labelMapData.getPointData().getScalars().getData().length)
  });

  labelMapData.getPointData().setScalars(dataArrayVtk);
  return labelMapData;
}
