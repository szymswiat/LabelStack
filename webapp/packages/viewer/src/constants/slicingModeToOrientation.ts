import { Orientation } from '@cornerstonejs/core/dist/esm/types';
import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';
import { ORIENTATION } from '@cornerstonejs/core/dist/esm/constants';

function getOrientation(slicingMode: SlicingMode): Orientation {
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
