import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface ViewerSettingsState {
  undoHotkeys: string[];
  redoHotkeys: string[];
  increaseToolSizeHotkeys: string[];
  decreaseToolSizeHotkeys: string[];
  eraseModeHotkeys: string[];
  saveHotkeys: string[];
  nextImageHotkeys: string[];
  prevImageHotkeys: string[];
  invertColorsHotkeys: string[];

  activatePaintToolHotkeys: string[];
  activatePolygonToolHotkeys: string[];
  activateSplineToolHotkeys: string[];

  autoSaveInterval: number;
}

export interface ViewerSettingsApi {
  setUndoHotkeys: (hotkeys: string[]) => void;
  setRedoHotkeys: (hotkeys: string[]) => void;
  setIncreaseToolSizeHotkeys: (hotkeys: string[]) => void;
  setDecreaseToolSizeHotkeys: (hotkeys: string[]) => void;
  setEraseModeHotkeys: (hotkeys: string[]) => void;
  setSaveHotkeys: (hotkeys: string[]) => void;
  setNextImageHotkeys: (hotkeys: string[]) => void;
  setPrevImageHotkeys: (hotkeys: string[]) => void;
  setInvertColorsHotkeys: (hotkeys: string[]) => void;

  setActivatePaintToolHotkeys: (hotkeys: string[]) => void;
  setActivatePolygonToolHotkeys: (hotkeys: string[]) => void;
  setActivateSplineToolHotkeys: (hotkeys: string[]) => void;

  setAutoSaveInterval: (interval: number) => void;
}

export type ViewerSettingsContextType = [ViewerSettingsState, ViewerSettingsApi];

export const ViewerSettingsContext = createContext<ViewerSettingsContextType>(null);

export const useViewerSettingsContext = () => useContext(ViewerSettingsContext);

export const ViewerSettingsContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [undoHotkeys, setUndoHotkeys] = useState<string[]>(['ctrl+z']);
  const [redoHotkeys, setRedoHotkeys] = useState<string[]>(['ctrl+y,ctrl+shift+z']);
  const [increaseToolSizeHotkeys, setIncreaseToolSizeHotkeys] = useState<string[]>(['alt+=']);
  const [decreaseToolSizeHotkeys, setDecreaseToolSizeHotkeys] = useState<string[]>(['alt-=']);
  const [drawModeHotkeys, setDrawModeHotkeys] = useState<string[]>(['d']);
  const [eraseModeHotkeys, setEraseModeHotkeys] = useState<string[]>(['e']);
  const [saveHotkeys, setSaveHotkeys] = useState<string[]>(['alt+s']);
  const [nextImageHotkeys, setNextImageHotkeys] = useState<string[]>(['right']);
  const [prevImageHotkeys, setPrevImageHotkeys] = useState<string[]>(['left']);
  const [invertColorsHotkeys, setInvertColorsHotkeys] = useState<string[]>(['i']);

  const [activatePaintToolHotkeys, setActivatePaintToolHotkeys] = useState<string[]>(['b']);
  const [activatePolygonToolHotkeys, setActivatePolygonToolHotkeys] = useState<string[]>(['p']);
  const [activateSplineToolHotkeys, setActivateSplineToolHotkeys] = useState<string[]>(['s']);

  const [autoSaveInterval, setAutoSaveInterval] = useState<number>(15)

  const state: ViewerSettingsState = {
    undoHotkeys,
    redoHotkeys,
    increaseToolSizeHotkeys,
    decreaseToolSizeHotkeys,
    eraseModeHotkeys,
    saveHotkeys,
    nextImageHotkeys,
    prevImageHotkeys,
    invertColorsHotkeys,

    activatePaintToolHotkeys,
    activatePolygonToolHotkeys,
    activateSplineToolHotkeys,

    autoSaveInterval
  };

  const api: ViewerSettingsApi = {
    setUndoHotkeys,
    setRedoHotkeys,
    setIncreaseToolSizeHotkeys,
    setDecreaseToolSizeHotkeys,
    setEraseModeHotkeys,
    setSaveHotkeys,
    setNextImageHotkeys,
    setPrevImageHotkeys,
    setInvertColorsHotkeys,

    setActivatePaintToolHotkeys,
    setActivatePolygonToolHotkeys,
    setActivateSplineToolHotkeys,

    setAutoSaveInterval
  };

  return <ViewerSettingsContext.Provider value={[state, api]}>{children}</ViewerSettingsContext.Provider>;
};
