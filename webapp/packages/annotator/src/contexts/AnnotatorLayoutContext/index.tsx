import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface AnnotatorLayoutState {
  editModeLocked: boolean;
}

export interface AnnotatorLayoutApi {
  setEditModeLocked: (editModeLocked: boolean) => void;
}

export type AnnotatorLayoutContextType = [AnnotatorLayoutState, AnnotatorLayoutApi];

export const AnnotatorLayoutContext = createContext<AnnotatorLayoutContextType>(null);

export const useAnnotatorLayoutContext = () => useContext(AnnotatorLayoutContext);

export const AnnotatorLayoutContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [editModeLocked, setEditModeLocked] = useState<boolean>(false);

  const state: AnnotatorLayoutState = {
    editModeLocked
  };

  const api: AnnotatorLayoutApi = {
    setEditModeLocked
  };

  return <AnnotatorLayoutContext.Provider value={[state, api]}>{children}</AnnotatorLayoutContext.Provider>;
};
