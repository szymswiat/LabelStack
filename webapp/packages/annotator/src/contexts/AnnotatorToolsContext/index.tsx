import { useLocalStorage } from '@labelstack/app/src/utils/hooks';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import LabelMapDrawerCompanion from '../../vtk/LabelMapDrawer/LabelMapDrawerCompanion';

export enum AnnotatorWidgetTool {
  BRUSH = 'brush',
  POLYGON = 'polygon',
  SPLINE = 'spline'
}

export enum DrawMode {
  DRAW = 1,
  ERASE = 0
}

export enum DrawerMode {
  SLICE,
  VOLUME
}

export interface AnnotatorToolsState {
  toolSize: number;
  activeTool: AnnotatorWidgetTool;
  drawMode: DrawMode;
  drawerMode: DrawerMode;

  undoTrigger: number;
  redoTrigger: number;

  canUndo: boolean;
  canRedo: boolean;
}

export interface AnnotatorToolsApi {
  setToolSize: (size: number) => void;
  setActiveTool: (tool: AnnotatorWidgetTool) => void;
  setDrawMode: (mode: DrawMode) => void;
  setDrawerMode: (mode: DrawerMode) => void;

  triggerUndo: () => void;
  triggerRedo: () => void;

  setCanUndo: (can: boolean) => void;
  setCanRedo: (can: boolean) => void;

  attachWidgetManager: (id: string, widgetManager: LabelMapDrawerCompanion) => void;
  detachWidgetManager: (id: string) => void;

  syncDrawersData: (source: LabelMapDrawerCompanion) => void;
}

export type AnnotatorToolsContextType = [AnnotatorToolsState, AnnotatorToolsApi];

export const AnnotatorToolsContext = createContext<AnnotatorToolsContextType>(null);

export const useAnnotatorToolsContext = () => useContext(AnnotatorToolsContext);

export const AnnotatorToolsContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toolSize, setToolSize] = useLocalStorage<number>('annotatorToolSize', 15);
  const [activeTool, setActiveTool] = useLocalStorage<AnnotatorWidgetTool>(
    'annotatorSelectedTool',
    AnnotatorWidgetTool.BRUSH
  );
  const [drawMode, setDrawMode] = useLocalStorage<DrawMode>('annotatorDrawMode', DrawMode.DRAW);
  const [drawerMode, setDrawerMode] = useLocalStorage<DrawerMode>('annotatorDrawerMode', DrawerMode.SLICE);

  const [undoTrigger, setUndoTrigger] = useState<number>(0);
  const [redoTrigger, setRedoTrigger] = useState<number>(0);

  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  const [widgetManagers, setWidgetManagers] = useState<Record<string, LabelMapDrawerCompanion>>({});

  function triggerUndo() {
    setUndoTrigger(Date.now());
  }

  function triggerRedo() {
    setRedoTrigger(Date.now());
  }

  function attachWidgetManager(id: string, widgetManager: LabelMapDrawerCompanion) {
    widgetManagers[id] = widgetManager;
    setWidgetManagers({ ...widgetManagers });
  }

  function detachWidgetManager(id: string) {
    delete widgetManagers[id];
    setWidgetManagers({ ...widgetManagers });
  }

  function syncDrawersData(source: LabelMapDrawerCompanion) {
    Object.values(widgetManagers).forEach((manager) => {
      if (manager === source) {
        return;
      }
      manager.paintFilter.applyLabelMap(source.paintFilter.getOutputData());
    });
  }

  const state: AnnotatorToolsState = {
    toolSize,
    activeTool,
    drawMode,
    drawerMode,
    undoTrigger,
    redoTrigger,
    canUndo,
    canRedo
  };

  const api: AnnotatorToolsApi = {
    setToolSize,
    setActiveTool,
    setDrawMode,
    setDrawerMode,
    triggerUndo,
    triggerRedo,
    setCanUndo,
    setCanRedo,
    attachWidgetManager,
    detachWidgetManager,
    syncDrawersData
  };

  return <AnnotatorToolsContext.Provider value={[state, api]}>{children}</AnnotatorToolsContext.Provider>;
};
