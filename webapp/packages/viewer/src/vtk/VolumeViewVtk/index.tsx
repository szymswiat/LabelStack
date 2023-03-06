import React, { ReactNode } from 'react';
import { View } from 'react-vtk-js';
import { useImageDataContext } from '@labelstack/viewer/src/contexts/ImageDataContext';
import { useAnnotationDataContext } from '@labelstack/viewer/src/contexts/AnnotationDataContext';
import { MouseButtonType } from '../../types/vtkjs.ext';
import ImageVolumeRepresentation from '../ImageVolumeRepresentation';
import WindowLevelManipulator from '../WindowLevelManipulator';
import LabelMapVolumeRepresentation from '../LabelMapVolumeRepresentation';

export interface VolumeViewVtkProps {
  viewId: string;
  activeViewId: string;
  children?: ReactNode;
}

const VolumeViewVtk: React.FC<VolumeViewVtkProps> = (props) => {
  const { viewId, children } = props;
  const [{ imageData }] = useImageDataContext();
  const [{ labelMaps }] = useAnnotationDataContext();

  function renderLabelMapRepresentations() {
    if (imageData) {
      const { SeriesInstanceUID } = imageData.dataset;
      return (
        <>
          {Object.entries(labelMaps).map(([id, labelMap]) => (
            <LabelMapVolumeRepresentation
              key={`${SeriesInstanceUID}_${id}`}
              id={id}
              opacity={0.5}
              inputLabelMap={labelMap}
            />
          ))}
        </>
      );
    } else {
      return <></>;
    }
  }

  function renderManipulators() {
    return (
      <>
        <WindowLevelManipulator manipulatorOptions={{ button: MouseButtonType.RIGHT }} />
      </>
    );
  }

  return (
    <View
      id={viewId}
      cameraPosition={null}
      cameraViewUp={null}
      cameraParallelProjection={true}
      background={[0, 0, 0]}
      interactorSettings={interactorSettings}
      interactive={true}
    >
      {/* <WidgetManager slicingMode={slicingMode} onMount={onWidgetManagerMount} /> */}
      <ImageVolumeRepresentation imageData={imageData} />
      {renderLabelMapRepresentations()}
      {renderManipulators()}
      {children as JSX.Element}
    </View>
  );
};

const interactorSettings = [
  {
    button: MouseButtonType.LEFT,
    action: 'Rotate'
  },
  {
    button: MouseButtonType.MIDDLE,
    action: 'Pan'
  },
  {
    button: MouseButtonType.RIGHT,
    action: 'Zoom',
    scrollEnabled: true,
    control: true
  }
];

export default VolumeViewVtk;
