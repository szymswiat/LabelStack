import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface ImagePropertiesState {
  windowWidth: number;
  windowCenter: number;
  invertColors: boolean;

  visibleSlices: number[];
}

export interface ImagePropertiesApi {
  setWindowCenterWidth: (center: number, width: number) => void;
  setVisibleSlices: (visibleSlices: number[]) => void;
  setInvertColors: (invert: boolean) => void;
}

export type ImagePropertiesContextType = [ImagePropertiesState, ImagePropertiesApi];

export const ImagePropertiesContext = createContext<ImagePropertiesContextType>(null);

export const useImagePropertiesContext = () => useContext(ImagePropertiesContext);

export const ImagePropertiesContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [windowCenter, setWindowCenter] = useState<number>(0);
  const [invertColors, setInvertColors] = useState<boolean>(false);
  const [visibleSlices, setVisibleSlices] = useState<number[]>([0, 0, 0]);

  const state: ImagePropertiesState = {
    windowWidth,
    windowCenter,
    invertColors,
    visibleSlices
  };

  function setWindowCenterWidth(center: number, width: number) {
    setWindowCenter(center);
    setWindowWidth(width);
  }

  const api: ImagePropertiesApi = {
    setWindowCenterWidth,
    setVisibleSlices,
    setInvertColors
  };

  return <ImagePropertiesContext.Provider value={[state, api]}>{children}</ImagePropertiesContext.Provider>;
};
