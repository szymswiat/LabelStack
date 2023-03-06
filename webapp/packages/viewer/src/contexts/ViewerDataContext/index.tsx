import React, { createContext, ReactNode, useContext, useState } from 'react';
import { AnnotationsObject, ImageInstancesObject, LabelAssignmentsObject, LabelsObject } from '@labelstack/api';

export interface ViewerDataState {
  viewerImageInstances?: ImageInstancesObject;
  viewerLabelAssignments?: LabelAssignmentsObject;
  viewerAnnotations?: AnnotationsObject;
  allLabels: LabelsObject | null;
}

export interface ViewerDataApi {
  setViewerImageInstances: (imageInstances: ImageInstancesObject) => void;
  setViewerLabelAssignments: (labelAssignments: LabelAssignmentsObject) => void;
  setViewerAnnotations: (annotations: AnnotationsObject) => void;

  setAllLabels: (labels: LabelsObject) => void;
}

export type ViewerDataContextType = [ViewerDataState, ViewerDataApi];

export const ViewerDataContext = createContext<ViewerDataContextType>(null);

export const useViewerDataContext = () => useContext(ViewerDataContext);

export const ViewerDataContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewerImageInstances, setViewerImageInstances] = useState<ImageInstancesObject | null>(null);
  const [viewerLabelAssignments, setViewerLabelAssignments] = useState<LabelAssignmentsObject | null>(null);
  const [viewerAnnotations, setViewerAnnotations] = useState<AnnotationsObject | null>(null);

  const [allLabels, setAllLabels] = useState<LabelsObject>(null);

  const state: ViewerDataState = {
    viewerImageInstances,
    viewerLabelAssignments,
    viewerAnnotations,
    allLabels
  };

  const api: ViewerDataApi = {
    setViewerImageInstances,
    setViewerLabelAssignments,
    setViewerAnnotations,
    setAllLabels
  };

  return <ViewerDataContext.Provider value={[state, api]}>{children}</ViewerDataContext.Provider>;
};
