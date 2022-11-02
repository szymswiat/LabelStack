import React, { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import LabelStackApp from './app';

import './index.css';
import { UserDataProvider } from './contexts/UserDataContext';
import { AnnotationDataContextProvider } from '@labelstack/viewer/src/contexts/AnnotationDataContext';
import { ViewerLayoutContextProvider } from '@labelstack/viewer/src/contexts/ViewerLayoutContext';
import { ImageDataContextProvider } from '@labelstack/viewer/src/contexts/ImageDataContext';
import { ImagePropertiesContextProvider } from '@labelstack/viewer/src/contexts/ImagePropertiesContext';
import { AnnotatorDataContextProvider } from '@labelstack/annotator/src/contexts/AnnotatorDataContext';
import { AnnotatorToolsContextProvider } from '@labelstack/annotator/src/contexts/AnnotatorToolsContext';
import { AnnotatorLayoutContextProvider } from '@labelstack/annotator/src/contexts/AnnotatorLayoutContext';
import { HotkeysControllerContextProvider } from '@labelstack/viewer/src/contexts/HotkeysControllerContext';
import { ViewerDataContextProvider } from '@labelstack/viewer/src/contexts/ViewerDataContext';
import { EditedAnnotationDataContextProvider } from '@labelstack/annotator/src/contexts/EditedAnnotationDataContext';

const appProviders = [UserDataProvider];

const annotatorProviders = [
  HotkeysControllerContextProvider,
  AnnotationDataContextProvider,
  EditedAnnotationDataContextProvider,
  ViewerLayoutContextProvider,
  ImageDataContextProvider,
  ImagePropertiesContextProvider,
  AnnotatorDataContextProvider,
  AnnotatorToolsContextProvider,
  ViewerDataContextProvider,
  AnnotatorLayoutContextProvider
];

const CombinedProviders: React.FC<{ children?: ReactNode; components: React.Component[] }> = ({
  children,
  components
}) => {
  return (
    <>
      {components.reduceRight((acc, curr) => {
        const [Comp, props] = Array.isArray(curr) ? [curr[0], curr[1]] : [curr, {}];
        return <Comp {...props}>{acc}</Comp>;
      }, children)}
    </>
  );
};

const root = createRoot(document.getElementById('root'));

root.render(
  // TODO: WA ag-grid is not working in strict mode
  // <React.StrictMode>
  <CombinedProviders components={[].concat(appProviders, annotatorProviders)}>
    <BrowserRouter>
      <LabelStackApp />
    </BrowserRouter>
  </CombinedProviders>
  // </React.StrictMode>
);
