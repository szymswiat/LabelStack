import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  BsArrowClockwise,
  BsArrowCounterclockwise,
  BsBezier2,
  BsBrushFill,
  BsEraserFill,
  BsHexagon,
  BsPaintBucket
} from 'react-icons/bs';
import PanelButton from '@labelstack/viewer/src/ui/components/PanelButton';
import { capitalize } from '@labelstack/viewer/src/utils';
import { useAnnotatorToolsContext } from '../../../contexts/AnnotatorToolsContext';
import classNames from 'classnames';
import { useViewerSettingsContext } from '@labelstack/viewer/src/contexts/ViewerSettingsContext';
import { AnnotatorWidgetTool, DrawerMode, DrawMode } from '../../../contexts/AnnotatorToolsContext';
import { useAnnotatorLayoutContext } from '../../../contexts/AnnotatorLayoutContext';

interface PaintToolOptionsProps {
  layoutOrientation: 'horizontal' | 'vertical';
}

const toolIcons = {
  [AnnotatorWidgetTool.BRUSH]: BsBrushFill,
  [AnnotatorWidgetTool.POLYGON]: BsHexagon,
  [AnnotatorWidgetTool.SPLINE]: BsBezier2
};

const drawEraseIcons = {
  [DrawMode.DRAW]: BsPaintBucket,
  [DrawMode.ERASE]: BsEraserFill
};

const undoRedoIcons = {
  undo: BsArrowCounterclockwise,
  redo: BsArrowClockwise
};

export const PaintToolOptions: React.FC<PaintToolOptionsProps> = ({ layoutOrientation }) => {
  const [
    { drawMode, activeTool, canUndo, canRedo, drawerMode },
    { setActiveTool, triggerUndo, triggerRedo, setDrawMode, setDrawerMode }
  ] = useAnnotatorToolsContext();
  const [{ editModeLocked }] = useAnnotatorLayoutContext();

  const [
    {
      undoHotkeys,
      redoHotkeys,
      eraseModeHotkeys,

      activatePaintToolHotkeys,
      activatePolygonToolHotkeys,
      activateSplineToolHotkeys
    }
  ] = useViewerSettingsContext();

  // TODO: move to separate component, enabled globally
  useHotkeys(undoHotkeys.join(','), triggerUndo, [triggerUndo]);
  useHotkeys(redoHotkeys.join(','), triggerRedo, [triggerRedo]);

  useHotkeys(eraseModeHotkeys.join(','), () => setDrawMode(DrawMode.ERASE), [setDrawMode]);
  useHotkeys(eraseModeHotkeys.join(','), () => setDrawMode(DrawMode.DRAW), { keyup: true }, [setDrawMode]);

  useHotkeys(activatePaintToolHotkeys.join(','), () => setActiveTool(AnnotatorWidgetTool.BRUSH), [setActiveTool]);
  useHotkeys(activatePolygonToolHotkeys.join(','), () => setActiveTool(AnnotatorWidgetTool.POLYGON), [setActiveTool]);
  useHotkeys(activateSplineToolHotkeys.join(','), () => setActiveTool(AnnotatorWidgetTool.SPLINE), [setActiveTool]);

  const drawModeActive = drawMode === DrawMode.DRAW;

  return (
    <div
      className={classNames('flex', {
        'flex-col gap-y-6': layoutOrientation === 'vertical',
        'flex-row gap-x-6': layoutOrientation === 'horizontal'
      })}
    >
      <div className={'flex flex-row gap-x-2'}>
        {Object.values(AnnotatorWidgetTool).map((tool) => {
          return (
            <PanelButton
              key={tool}
              name={capitalize(tool as string)}
              containerClassName={'w-10 h-10'}
              isActive={activeTool === tool}
              onClick={() => setActiveTool(tool as AnnotatorWidgetTool)}
              icon={toolIcons[tool]}
              iconProps={{ size: 20 }}
              disabled={editModeLocked}
            />
          );
        })}
      </div>
      <div className={'flex flex-row gap-x-2'}>
        <PanelButton
          name={'Draw'}
          containerClassName={'w-10 h-10'}
          isActive={drawModeActive}
          onClick={() => setDrawMode(DrawMode.DRAW)}
          icon={drawEraseIcons[DrawMode.DRAW]}
          iconProps={{ size: 20 }}
          disabled={editModeLocked}
        />
        <PanelButton
          name={'Erase'}
          containerClassName={'w-10 h-10'}
          isActive={!drawModeActive}
          onClick={() => setDrawMode(DrawMode.ERASE)}
          icon={drawEraseIcons[DrawMode.ERASE]}
          iconProps={{ size: 20 }}
          disabled={editModeLocked}
        />
        <PanelButton
          name={'3D'}
          description={'Draw 3D'}
          containerClassName={'w-10 h-10'}
          iconClassName={'font-bold'}
          isActive={drawerMode === DrawerMode.VOLUME}
          onClick={() => setDrawerMode(drawerMode === DrawerMode.SLICE ? DrawerMode.VOLUME : DrawerMode.SLICE)}
          disabled={editModeLocked}
        />
      </div>
      <div className={'flex flex-row gap-x-2'}>
        <PanelButton
          name={'Undo'}
          containerClassName={'w-10 h-10'}
          isActive={false}
          disabled={!canUndo || editModeLocked}
          onClick={triggerUndo}
          icon={undoRedoIcons.undo}
          iconProps={{ size: 20 }}
        />
        <PanelButton
          name={'Redo'}
          containerClassName={'w-10 h-10'}
          isActive={false}
          disabled={!canRedo || editModeLocked}
          onClick={triggerRedo}
          icon={undoRedoIcons.redo}
          iconProps={{ size: 20 }}
        />
      </div>
    </div>
  );
};
