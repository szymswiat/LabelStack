import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface EditedAnnotationDataState {
  editedLabelMapId: string | null;
  uploadAnnotationsTrigger: number;
}

export interface EditedAnnotationDataApi {
  setEditedLabelMapId: (editedLabelMapId: string | null) => void;
  triggerAnnotationsUpload: () => void;
}

export type EditedAnnotationDataContextType = [EditedAnnotationDataState, EditedAnnotationDataApi];

export const EditedAnnotationDataContext = createContext<EditedAnnotationDataContextType>(null);

export const useEditedAnnotationDataContext = () => useContext(EditedAnnotationDataContext);

export const EditedAnnotationDataContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [editedLabelMapId, setEditedLabelMapId] = useState<string | null>(null);
  const [uploadAnnotationsTrigger, setUploadAnnotationsTrigger] = useState<number>(0);

  function triggerAnnotationsUpload() {
    setUploadAnnotationsTrigger(Date.now());
  }

  const state: EditedAnnotationDataState = {
    editedLabelMapId,
    uploadAnnotationsTrigger
  };

  const api: EditedAnnotationDataApi = {
    setEditedLabelMapId,
    triggerAnnotationsUpload
  };

  return <EditedAnnotationDataContext.Provider value={[state, api]}>{children}</EditedAnnotationDataContext.Provider>;
};
