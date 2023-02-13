import React, { ReactNode } from 'react';
import ImageSliceRepresentation from '@labelstack/viewer/src/vtk/ImageSliceRepresentation';
import { View } from 'react-vtk-js';
import LabelMapSliceRepresentation from '@labelstack/viewer/src/vtk/LabelMapSliceRepresentation';
import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';
import WindowLevelManipulator from '@labelstack/viewer/src/vtk/WindowLevelManipulator';
import SliceManipulator from '@labelstack/viewer/src/vtk/SliceManipulator';
import { useImageDataContext } from '@labelstack/viewer/src/contexts/ImageDataContext';
import { useAnnotationDataContext } from '@labelstack/viewer/src/contexts/AnnotationDataContext';
import { MouseButtonType } from '../../types/vtkjs.ext';
import { useViewerLayoutContext } from '../../contexts/ViewerLayoutContext';
import SliceViewCompanion from './SliceViewCompanion';
import { useEffectNonNull } from '@labelstack/app/src/utils/hooks';
import { useHookCompanion } from '../../utils/HookCompanion';
import WidgetManager from '../WidgetManager';
import WidgetManagerCompanion from '../WidgetManager/WidgetManagerCompanion';

export interface SliceViewProps {
  viewId: string;
  activeViewId: string;
  slicingMode: SlicingMode;
  children?: ReactNode;

  parentHookCompanion?: SliceViewCompanion;
}

const SliceView: React.FC<SliceViewProps> = (props) => {
  const { viewId, children, slicingMode, parentHookCompanion } = props;
  const [, viewerLayoutApi] = useViewerLayoutContext();
  const [{ imageData }] = useImageDataContext();
  const [{ labelMaps }] = useAnnotationDataContext();

  let hookCompanion: SliceViewCompanion;

  if (parentHookCompanion) {
    hookCompanion = parentHookCompanion;
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    hookCompanion = useHookCompanion(SliceViewCompanion, { ...props }, (companion) => {
      companion.setViewerLayoutContext(viewerLayoutApi);
    });
  }

  useEffectNonNull(
    () => {
      hookCompanion.setViewerLayoutContext(viewerLayoutApi);
    },
    [],
    [hookCompanion]
  );

  function onWidgetManagerMount(widgetManager: WidgetManagerCompanion) {
    hookCompanion.widgetManager = widgetManager;
    hookCompanion.triggerHookUpdate();
  }

  function renderLabelMapRepresentations() {
    if (imageData) {
      const { SeriesInstanceUID } = imageData.dataset;
      return (
        <>
          {Object.entries(labelMaps).map(([id, labelMap]) => (
            <LabelMapSliceRepresentation
              key={`${SeriesInstanceUID}_${id}`}
              id={id}
              opacity={0.5}
              slicingMode={slicingMode}
              sliceViewCompanion={hookCompanion}
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
        <SliceManipulator
          manipulatorOptions={{ button: MouseButtonType.NONE, scrollEnabled: true, scale: 1 }}
          manipulatorOptionsSecond={{ button: MouseButtonType.NONE, scrollEnabled: true, scale: 10, alt: true }}
          slicingMode={slicingMode}
        />
      </>
    );
  }

  if (!hookCompanion) {
    return <></>;
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
      <WidgetManager slicingMode={slicingMode} onMount={onWidgetManagerMount} />
      <ImageSliceRepresentation imageData={imageData} slicingMode={slicingMode} />
      {renderLabelMapRepresentations()}
      {renderManipulators()}
      {children as JSX.Element}
    </View>
  );
};

const interactorSettings = [
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

export default SliceView;
