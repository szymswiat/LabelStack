import { Orientation } from '@cornerstonejs/core/dist/esm/types';
import vtkImageMapper, { SlicingMode as SlicingModeType } from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import { ORIENTATION } from '@cornerstonejs/core/dist/esm/constants';

// @ts-ignore
const { SlicingMode } = vtkImageMapper;

function getOrientation(slicingMode: SlicingModeType): Orientation {
  switch (slicingMode) {
    case SlicingMode.K:
      return ORIENTATION.AXIAL;
    case SlicingMode.I:
      return ORIENTATION.SAGITTAL;
    case SlicingMode.J:
      return ORIENTATION.CORONAL;
  }
  throw Error('Invalid slicing mode.');
}

export { getOrientation };
