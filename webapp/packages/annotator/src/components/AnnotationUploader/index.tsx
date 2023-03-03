import React, { useEffect, useRef } from 'react';
import { useEffectNonNullAsync } from '@labelstack/app/src/utils/hooks';
import { LabelMap, useAnnotationDataContext } from '@labelstack/viewer/src/contexts/AnnotationDataContext';
import { useEditedAnnotationDataContext } from '../../contexts/EditedAnnotationDataContext';
import { AnnotationsObject, api } from '@labelstack/api';
import { encodeLabelMap } from '@labelstack/viewer/src/utils/labelMapUtils';
import { showDangerNotification, showInfoNotification } from '@labelstack/app/src/utils';
import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';
import { useViewerSettingsContext } from '@labelstack/viewer/src/contexts/ViewerSettingsContext';
import { useAnnotatorDataContext } from '../../contexts/AnnotatorDataContext';

export interface AnnotationUploaderProps {
  annotations: AnnotationsObject;
}

const AnnotationUploader: React.FC<AnnotationUploaderProps> = ({ annotations }) => {
  const [{ uploadAnnotationsTrigger }] = useEditedAnnotationDataContext();
  const [{ labelMaps }, { updateLabelMap }] = useAnnotationDataContext();
  const [{ token }] = useUserDataContext();
  const [{ autoSaveInterval }] = useViewerSettingsContext();
  const [, { refreshTaskObjects }] = useAnnotatorDataContext();

  const uploadAllEligibleLabelMapsRef = useRef(uploadAllEligibleLabelMaps);
  const refreshTaskObjectsRef = useRef(refreshTaskObjects);

  uploadAllEligibleLabelMapsRef.current = uploadAllEligibleLabelMaps;
  refreshTaskObjectsRef.current = refreshTaskObjects;

  async function uploadLabelMap(labelMap: LabelMap) {
    const annotationToUpdate = annotations[labelMap.id.annotationId];

    const compressedData = await encodeLabelMap(labelMap.data);

    try {
      console.log(`Uploading label map ${labelMap.name}`);
      await api.createAnnotationData(token, annotationToUpdate, compressedData.buffer);
      updateLabelMap({ ...labelMap, modificationTime: 0 });
    } catch (reason) {
      if (!reason.response) {
        throw reason;
      }
      if (reason.response.status === 409) {
        showInfoNotification('No update', reason.response.data.detail);
      } else {
        showDangerNotification('Error', reason.response.data.detail);
      }
    }
  }

  async function uploadAllEditableLabelMaps() {
    const filteredLabelMaps = Object.values(labelMaps).filter(
      (labelMap) => labelMap.editable && labelMap.modificationTime
    );
    await Promise.all(filteredLabelMaps.map(uploadLabelMap));
    return filteredLabelMaps;
  }

  async function uploadAllEligibleLabelMaps() {
    const filteredLabelMaps = Object.values(labelMaps).filter((labelMap) => {
      const delayPassed = Date.now() - labelMap.modificationTime > autoSaveInterval * 1000;
      return labelMap.editable && labelMap.modificationTime && delayPassed;
    });
    await Promise.all(filteredLabelMaps.map(uploadLabelMap));
    return filteredLabelMaps;
  }

  useEffectNonNullAsync(
    async () => {
      const labelMaps = await uploadAllEditableLabelMaps();
      if (labelMaps.length > 0) {
        refreshTaskObjects();
      }
    },
    [],
    [uploadAnnotationsTrigger]
  );

  useEffect(() => {
    console.log('Starting uploader');
    setInterval(async () => {
      const labelMaps = await uploadAllEligibleLabelMapsRef.current();
      if (labelMaps.length > 0) {
        refreshTaskObjectsRef.current();
      }
    }, 1000);
  }, []);

  return <></>;
};

export default AnnotationUploader;
