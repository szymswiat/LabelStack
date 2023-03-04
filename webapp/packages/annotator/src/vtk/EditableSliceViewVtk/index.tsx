import React from 'react';

import SliceViewVtk, { SliceViewVtkProps } from '@labelstack/viewer/src/vtk/SliceViewVtk';
import { useImageDataContext } from '@labelstack/viewer/src/contexts/ImageDataContext';
import SliceViewVtkCompanion from '@labelstack/viewer/src/vtk/SliceViewVtk/SliceViewVtkCompanion';
import { useHookCompanion } from '@labelstack/viewer/src/utils/HookCompanion';
import { useViewerLayoutContext } from '@labelstack/viewer/src/contexts/ViewerLayoutContext';
import { useEditedAnnotationDataContext } from '../../contexts/EditedAnnotationDataContext';
import LabelMapDrawer from '../LabelMapDrawer';
import ToolSizeManipulator from '../ToolSizeManipulator';
import { MouseButtonType } from '@labelstack/viewer/src/types/vtkjs.ext';

interface EditableSliceViewVtkProps extends SliceViewVtkProps {}

const EditableSliceViewVtk: React.FC<EditableSliceViewVtkProps> = (props) => {
  const { viewId, slicingMode } = props;
  const [{ imageData }] = useImageDataContext();
  const [, viewerLayoutApi] = useViewerLayoutContext();
  const [{ editedLabelMapId }] = useEditedAnnotationDataContext();

  const hookCompanion = useHookCompanion(SliceViewVtkCompanion, { ...props }, (companion) => {
    companion.setViewerLayoutContext(viewerLayoutApi);
  });

  if (!hookCompanion) {
    return <></>;
  }

  const activeRepresentation = hookCompanion.labelMapRepresentations[editedLabelMapId];

  return (
    <SliceViewVtk {...props} parentHookCompanion={hookCompanion}>
      {activeRepresentation && imageData && hookCompanion.widgetManager && (
        <>
          <LabelMapDrawer viewId={viewId} slicingMode={slicingMode} sliceViewVtkCompanion={hookCompanion} />
          <ToolSizeManipulator
            manipulatorOptions={{ button: MouseButtonType.NONE, scrollEnabled: true, scale: 2, shift: true }}
            minToolSize={5}
            maxToolSize={40}
          />
        </>
      )}
    </SliceViewVtk>
  );
};

export default EditableSliceViewVtk;
