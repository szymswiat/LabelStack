import React, { createContext, ReactNode, useContext, useState } from 'react';
import { LabelMap, LabelMapsObject } from './LabelMap';

export * from './LabelMap';

export interface AnnotationDataState {
  labelMaps: LabelMapsObject;
}

export interface AnnotationDataApi {
  setLabelMaps: (labelMaps: LabelMap[]) => void;
  updateLabelMap: (labelMap: LabelMap) => void;
}

export type AnnotationDataContextType = [AnnotationDataState, AnnotationDataApi];

export const AnnotationDataContext = createContext<AnnotationDataContextType>(null);

export const useAnnotationDataContext = () => useContext(AnnotationDataContext);

export const AnnotationDataContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [labelMaps, setLabelMapsState] = useState<LabelMapsObject>({});
  const [composeObjectUpdateTrigger, setComposeObjectUpdateTrigger] = useState<number>(0);

  function setLabelMaps(labelMaps: LabelMap[]) {
    setLabelMapsState(Object.fromEntries(labelMaps.map((labelMap) => [labelMap.id.uniqueId, labelMap])));
  }

  function updateLabelMap(labelMap: LabelMap) {
    if (!(labelMap.id.uniqueId in labelMaps)) {
      throw Error(`LabelMap with ${labelMap.id.uniqueId} does not exist in context. Cannot update.`);
    }
    labelMaps[labelMap.id.uniqueId] = labelMap;
    setComposeObjectUpdateTrigger(Date.now());
  }

  const state: AnnotationDataState = {
    labelMaps
  };

  const api: AnnotationDataApi = {
    setLabelMaps,
    updateLabelMap
  };

  return <AnnotationDataContext.Provider value={[state, api]}>{children}</AnnotationDataContext.Provider>;
};
