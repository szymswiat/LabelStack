import React from 'react';

import SliceView, { SliceViewProps } from '@labelstack/viewer/src/vtk/SliceView';
import { useImageDataContext } from '@labelstack/viewer/src/contexts/ImageDataContext';
import SliceViewCompanion from '@labelstack/viewer/src/vtk/SliceView/SliceViewCompanion';
import { useHookCompanion } from '@labelstack/viewer/src/utils/HookCompanion';
import { useViewerLayoutContext } from '@labelstack/viewer/src/contexts/ViewerLayoutContext';
import { useEditedAnnotationDataContext } from '../../contexts/EditedAnnotationDataContext';
import LabelMapDrawer from '../LabelMapDrawer';
import ToolSizeManipulator from '../ToolSizeManipulator';
import { MouseButtonType } from '@labelstack/viewer/src/types/vtkjs.ext';

interface EditableSliceViewProps extends SliceViewProps {}

const EditableSliceView: React.FC<EditableSliceViewProps> = (props) => {
  const { viewId, slicingMode } = props;
  const [{ imageData }] = useImageDataContext();
  const [, viewerLayoutApi] = useViewerLayoutContext();
  const [{ editedLabelMapId }] = useEditedAnnotationDataContext();

  const hookCompanion = useHookCompanion(SliceViewCompanion, { ...props }, (companion) => {
    companion.setViewerLayoutContext(viewerLayoutApi);
  });

  if (!hookCompanion) {
    return <></>;
  }

  const activeRepresentation = hookCompanion.labelMapRepresentations[editedLabelMapId];

  return (
    <SliceView {...props} parentHookCompanion={hookCompanion}>
      {activeRepresentation && imageData && hookCompanion.widgetManager && (
        <>
          <LabelMapDrawer viewId={viewId} slicingMode={slicingMode} sliceView={hookCompanion} />
          <ToolSizeManipulator
            manipulatorOptions={{ button: MouseButtonType.NONE, scrollEnabled: true, scale: 2, shift: true }}
            minToolSize={5}
            maxToolSize={40}
          />
        </>
      )}
    </SliceView>
  );
};

export default EditableSliceView;
