import React, { createContext, ReactNode, useContext, useState } from 'react';
import SliceViewCompanion from '../../vtk/SliceView/SliceViewCompanion';
import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper';

export enum ViewMode {
  ONE_SLICE,
  TWO_SLICES,
  THREE_SLICES
}

export enum UiComponentLocation {
  MAIN_VIEW = 0,
  SEPARATE_WINDOW = 1
}

export interface UiComponentLocations {
  toolBarLocation?: UiComponentLocation;

  leftPanelLocation?: UiComponentLocation;
  rightPanelLocation?: UiComponentLocation;
}

export type FloatingWindowsObject = Record<string, ReactNode>;

export interface ViewerLayoutState {
  activeViewId: string | null;
  sliceViews: Record<string, SliceViewCompanion>;
  slicingModes: Record<string, SlicingMode>;

  viewMode: ViewMode | null;
  componentLocations: UiComponentLocations;

  floatingWindows: FloatingWindowsObject;
  overlayWindow: ReactNode | null;
}

export interface ViewerLayoutApi {
  setActiveViewId: (id: string) => void;
  setViewMode: (viewMode: ViewMode) => void;
  updateComponentLocations: (componentLocations: UiComponentLocations) => void;
  setSlicingModes: (modes: Record<string, SlicingMode>) => void;

  showFloatingWindow: (name: string, windowNode: ReactNode) => void;
  hideFloatingWindow: (name: string) => void;

  showOverlayWindow: (windowNode: ReactNode) => void;
  hideOverlayWindow: () => void;

  attachSliceView: (id: string, view: SliceViewCompanion) => void;
  detachSliceView: (id: string) => void;
}

export type ViewerLayoutContextType = [ViewerLayoutState, ViewerLayoutApi];

export const ViewerLayoutContext = createContext<ViewerLayoutContextType>(null);

export const useViewerLayoutContext = () => useContext(ViewerLayoutContext);

export const ViewerLayoutContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeViewId, setActiveViewId] = useState<string | null>('0');
  const [viewMode, setViewMode] = useState<ViewMode | null>(null);
  const [componentLocations, setComponentLocations] = useState<UiComponentLocations>({
    toolBarLocation: UiComponentLocation.MAIN_VIEW,
    leftPanelLocation: UiComponentLocation.MAIN_VIEW,
    rightPanelLocation: UiComponentLocation.MAIN_VIEW
  });
  const [slicingModes, setSlicingModes] = useState<Record<string, SlicingMode>>({});
  const [floatingWindows, setFloatingWindows] = useState<FloatingWindowsObject>({});
  const [overlayWindow, setOverlayWindow] = useState<ReactNode | null>(null);
  const [sliceViews, setSliceViews] = useState<Record<string, SliceViewCompanion>>({});

  function updateComponentLocations(newComponentLocations: UiComponentLocations) {
    setComponentLocations(Object.assign({ ...componentLocations }, newComponentLocations));
  }

  function showFloatingWindow(name: string, windowNode: ReactNode) {
    floatingWindows[name] = windowNode;
    setFloatingWindows({ ...floatingWindows });
  }

  function hideFloatingWindow(name: string) {
    delete floatingWindows[name];
    setFloatingWindows({ ...floatingWindows });
  }

  function showOverlayWindow(windowNode: ReactNode) {
    setOverlayWindow(windowNode);
  }

  function hideOverlayWindow() {
    setOverlayWindow(null);
  }

  function attachSliceView(id: string, view: SliceViewCompanion) {
    sliceViews[id] = view;
    setSliceViews({ ...sliceViews });
  }

  function detachSliceView(id: string) {
    delete sliceViews[id];
    setSliceViews({ ...sliceViews });
  }

  const state: ViewerLayoutState = {
    activeViewId,
    viewMode,
    slicingModes,
    componentLocations,
    floatingWindows,
    overlayWindow,
    sliceViews
  };

  const api: ViewerLayoutApi = {
    setActiveViewId,
    setViewMode,
    updateComponentLocations,
    setSlicingModes,
    showFloatingWindow,
    hideFloatingWindow,
    showOverlayWindow,
    hideOverlayWindow,
    attachSliceView,
    detachSliceView
  };

  return <ViewerLayoutContext.Provider value={[state, api]}>{children}</ViewerLayoutContext.Provider>;
};
