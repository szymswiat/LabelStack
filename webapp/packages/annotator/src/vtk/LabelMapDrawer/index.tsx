import React, { useRef } from 'react';
import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import { useHookCompanion } from '@labelstack/viewer/src/utils/HookCompanion';
import LabelMapDrawerCompanion from './LabelMapDrawerCompanion';
import { useAnnotatorToolsContext } from '../../contexts/AnnotatorToolsContext';
import { useImageDataContext } from '@labelstack/viewer/src/contexts/ImageDataContext';
import { useEffectNonNull } from '@labelstack/app/src/utils/hooks';
import { useViewerLayoutContext } from '@labelstack/viewer/src/contexts/ViewerLayoutContext';
import { AnnotatorWidgetTool } from '../../contexts/AnnotatorToolsContext';
import BrushWidgetInstance from '../BrushWidgetInstance';
import SliceViewCompanion from '@labelstack/viewer/src/vtk/SliceView/SliceViewCompanion';
import { ViewTypes } from '@kitware/vtk.js/Widgets/Core/WidgetManager/Constants.js';
import { useEditedAnnotationDataContext } from '../../contexts/EditedAnnotationDataContext';
import { LabelMap, useAnnotationDataContext } from '@labelstack/viewer/src/contexts/AnnotationDataContext';
import PolygonWidgetInstance from '../PolygonWidgetInstance';
import SplineWidgetInstance from '../SplineWidgetInstance';

export interface LabelMapDrawerProps {
  viewId: string;
  slicingMode: SlicingMode;
  sliceView: SliceViewCompanion;
}

const LabelMapDrawer: React.FC<LabelMapDrawerProps> = (props) => {
  const { viewId, slicingMode, sliceView } = props;
  const [
    { drawMode, undoTrigger, redoTrigger, toolSize, activeTool, drawerMode },
    { attachWidgetManager, detachWidgetManager, setCanUndo, setCanRedo, syncDrawersData }
  ] = useAnnotatorToolsContext();
  const [{ imageData }] = useImageDataContext();
  const [{ activeViewId }] = useViewerLayoutContext();
  const [{ labelMaps }, { updateLabelMap }] = useAnnotationDataContext();
  const [{ editedLabelMapId }] = useEditedAnnotationDataContext();
  const editedLabelMapRepresentation = sliceView.labelMapRepresentations[editedLabelMapId];
  const editedLabelMap = labelMaps[editedLabelMapId];
  const editedLabelMapRef = useRef<LabelMap>(null);
  editedLabelMapRef.current = editedLabelMap;
  const isActiveRef = useRef<boolean>(null);
  isActiveRef.current = viewId === activeViewId;

  const hookCompanion = useHookCompanion(
    LabelMapDrawerCompanion,
    { ...props, drawerMode },
    (companion) => {
      attachWidgetManager(viewId, companion);
    },
    (companion) => {
      detachWidgetManager(viewId);
      updateLabelMap({ ...editedLabelMapRef.current, data: companion.paintFilter.getOutputData() });
      companion.detachLabelMap();
    }
  );

  useEffectNonNull(
    () => () => {
      if (isActiveRef.current) {
        setCanUndo(false);
        setCanRedo(false);
      }
    },
    [],
    [hookCompanion]
  );

  useEffectNonNull(
    () => {
      hookCompanion.setBackgroundImage(imageData);
    },
    [],
    [hookCompanion, imageData]
  );

  useEffectNonNull(
    () => {
      hookCompanion.setDrawMode(drawMode);
    },
    [],
    [hookCompanion, drawMode]
  );

  useEffectNonNull(
    () => {
      if (undoTrigger !== 0) {
        hookCompanion.undo();
        if (isActiveRef.current) {
          setCanUndo(hookCompanion.canUndo());
          setCanRedo(hookCompanion.canRedo());
          updateLabelMap({ ...editedLabelMap, isModified: true });
        }
      }
    },
    [undoTrigger],
    [hookCompanion]
  );

  useEffectNonNull(
    () => {
      if (redoTrigger !== 0) {
        hookCompanion.redo();
        if (isActiveRef.current) {
          setCanUndo(hookCompanion.canUndo());
          setCanRedo(hookCompanion.canRedo());
          updateLabelMap({ ...editedLabelMap, isModified: true });
        }
      }
    },
    [redoTrigger],
    [hookCompanion]
  );

  useEffectNonNull(
    () => {
      hookCompanion.setPaintFilterRadius(toolSize);
    },
    [toolSize],
    [hookCompanion]
  );

  useEffectNonNull(
    () => {
      hookCompanion.setSlicingMode(slicingMode);
    },
    [slicingMode],
    [hookCompanion]
  );

  useEffectNonNull(
    () => {
      hookCompanion.detachLabelMap();
      hookCompanion.attachLabelMap(editedLabelMapRepresentation);
    },
    [],
    [hookCompanion, editedLabelMapRepresentation]
  );

  useEffectNonNull(
    () => {
      hookCompanion.setDrawerMode(drawerMode);
    },
    [drawerMode],
    [hookCompanion]
  );

  function onInteractionEnd() {
    syncDrawersData(hookCompanion);
    updateLabelMap({ ...editedLabelMap, isModified: true, data: hookCompanion.paintFilter.getOutputData() });
    setCanUndo(hookCompanion.canUndo());
    setCanRedo(hookCompanion.canRedo());
  }

  if (!hookCompanion || !isActiveRef.current || !editedLabelMapId || !imageData) {
    return;
  }

  let WidgetToAttach;
  switch (activeTool) {
    case AnnotatorWidgetTool.BRUSH:
      WidgetToAttach = BrushWidgetInstance;
      break;
    case AnnotatorWidgetTool.POLYGON:
      WidgetToAttach = PolygonWidgetInstance;
      break;
    case AnnotatorWidgetTool.SPLINE:
      WidgetToAttach = SplineWidgetInstance;
      break;
  }

  if (WidgetToAttach) {
    return (
      <WidgetToAttach
        size={toolSize}
        slicingMode={slicingMode}
        widgetManager={sliceView.widgetManager}
        labelMapDrawer={hookCompanion}
        viewType={ViewTypes.SLICE}
        imageData={imageData}
        onPaintInteractionEnd={onInteractionEnd}
      />
    );
  }

  return <></>;
};

export default LabelMapDrawer;
