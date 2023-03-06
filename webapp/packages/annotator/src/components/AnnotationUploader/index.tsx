import React from 'react';
import { useEffectNonNull } from '@labelstack/app/src/utils/hooks';
import { LabelMap, useAnnotationDataContext } from '@labelstack/viewer/src/contexts/AnnotationDataContext';
import { useEditedAnnotationDataContext } from '../../contexts/EditedAnnotationDataContext';
import { AnnotationsObject, api } from '@labelstack/api';
import { encodeLabelMap } from '@labelstack/viewer/src/utils/labelMapUtils';
import { showInfoNotification } from '@labelstack/app/src/utils';
import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';

export interface AnnotationUploaderProps {
  annotations: AnnotationsObject;
}

const AnnotationUploader: React.FC<AnnotationUploaderProps> = ({ annotations }) => {
  const [{ uploadAnnotationsTrigger }] = useEditedAnnotationDataContext();
  const [{ labelMaps }, { updateLabelMap }] = useAnnotationDataContext();
  const [{ token }] = useUserDataContext();

  async function uploadLabelMap(labelMap: LabelMap) {
    const annotationToUpdate = annotations[labelMap.id.annotationId];

    const compressedData = await encodeLabelMap(labelMap.data);

    try {
      await api.createAnnotationData(token, annotationToUpdate, compressedData.buffer);
      updateLabelMap({ ...labelMap, isModified: false });
    } catch (reason) {
      if (reason.response.status === 409) {
        showInfoNotification('No update', reason.response.data.detail);
        updateLabelMap({ ...labelMap, isModified: false });
      }
    }
  }

  useEffectNonNull(
    () => {
      const [callback] = uploadAnnotationsTrigger;
      Promise.all(
        Object.values(labelMaps)
          .filter((labelMap) => labelMap.editable && labelMap.isModified)
          .map(uploadLabelMap)
      ).then(callback);
    },
    [],
    [uploadAnnotationsTrigger]
  );

  return <></>;
};

export default AnnotationUploader;
