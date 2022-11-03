import React, { useEffect, useRef } from 'react';

import { useImageDataContext } from '@labelstack/viewer/src/contexts/ImageDataContext';
import { LabelMap, useAnnotationDataContext } from '@labelstack/viewer/src/contexts/AnnotationDataContext';
import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';
import { AnnotationsObject, api, ImageInstancesObject, LabelAssignmentsObject } from '@labelstack/api';
import { LabelMapId, LabelMapsObject } from '@labelstack/viewer/src/contexts/AnnotationDataContext/LabelMap';
import { useViewerDataContext } from '../../contexts/ViewerDataContext';
import { useNavigate } from 'react-router';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import { buildLabelMap, decodeLabelMap } from '../../utils/labelMapUtils';
import { useEffectNonNull } from '@labelstack/app/src/utils/hooks';

interface ViewerDataLoaderProps {
  imageInstanceIds: number[];
  imageInstanceId?: number;
}

const ViewerDataLoader: React.FC<ViewerDataLoaderProps> = ({ imageInstanceIds, imageInstanceId }) => {
  const [
    { allLabels, viewerAnnotations, viewerImageInstances },
    { setViewerLabelAssignments, setViewerAnnotations, setViewerImageInstances, setAllLabels }
  ] = useViewerDataContext();
  const [{ imageInstance, imageData }, { setImageInstance }] = useImageDataContext();
  const [{ labelMaps }, { setLabelMaps }] = useAnnotationDataContext();
  const [{ token }] = useUserDataContext();
  const prevImageInstanceId = useRef<number | null>(null);
  const prevImageInstanceIds = useRef<number[] | null>(null);
  const navigate = useNavigate();

  function routeToInstance(imageInstancesObject?: ImageInstancesObject) {
    const imageInstances = Object.values(imageInstancesObject ? imageInstancesObject : viewerImageInstances);
    const imageInstanceIdToSet =
      imageInstanceId && imageInstances.map((i) => i.id).includes(imageInstanceId)
        ? imageInstanceId
        : imageInstances[0].id;

    navigate(`?imageInstanceIds=${imageInstanceIds.join(',')}&imageInstanceId=${imageInstanceIdToSet}`);
  }

  function buildViewerObjects() {
    const viewerLabelAssignments: LabelAssignmentsObject = {};
    const viewerAnnotations: AnnotationsObject = {};

    imageInstance.label_assignments.forEach((labelAssignment) => {
      labelAssignment.imageInstance = imageInstance;
      viewerLabelAssignments[labelAssignment.id] = labelAssignment;
      labelAssignment.annotations.forEach((annotation) => {
        annotation.labelAssignment = labelAssignment;
        viewerAnnotations[annotation.id] = annotation;
      });
    });
    setViewerLabelAssignments(viewerLabelAssignments);
    setViewerAnnotations(viewerAnnotations);
  }

  async function loadAnnotationData() {
    if (!imageInstance) {
      return;
    }

    let newLabelMaps: LabelMapsObject = prevImageInstanceId.current === imageInstance.id ? labelMaps : {};
    for (const annotation of Object.values(viewerAnnotations)) {
      if (!annotation) {
        continue;
      }

      const label = allLabels[annotation.labelAssignment.label_id];
      const annotationData = annotation.data_list.at(-1);

      const newLabelMapId = LabelMapId.create(annotation.id);
      if (newLabelMapId.uniqueId in newLabelMaps) {
        continue;
      }

      let labelMapData: vtkImageData;
      if (annotationData) {
        const { data: encodedLabelMap } = await api.readAnnotationData(token, annotation, annotationData.sequence);
        labelMapData = await decodeLabelMap(imageData.vtkImage, encodedLabelMap);
      } else {
        labelMapData = await buildLabelMap(imageData.vtkImage);
      }

      const labelMapToDisplay: LabelMap = {
        id: newLabelMapId,
        name: label.name,
        color: [Math.random(), Math.random(), Math.random()],
        data: labelMapData,
        visibility: true,
        editable: false,
        modificationTime: 0
      };

      newLabelMaps[labelMapToDisplay.id.uniqueId] = labelMapToDisplay;
    }
    setLabelMaps(Object.values(newLabelMaps));
    prevImageInstanceId.current = imageInstance.id;
  }

  useEffect(() => {
    if (String(prevImageInstanceIds.current) == String(imageInstanceIds)) {
      return;
    }
    api.getImageInstances(token, false, false, imageInstanceIds).then((response) => {
      const { data: imageInstances } = response;
      const imageInstancesObject = Object.fromEntries(
        imageInstances.map((imageInstance) => [imageInstance.id, imageInstance])
      );
      setViewerImageInstances(imageInstancesObject);

      routeToInstance(imageInstancesObject);
    });
    prevImageInstanceIds.current = imageInstanceIds;
  }, [imageInstanceIds]);

  useEffect(() => {
    api.getLabels(token).then((response) => {
      setAllLabels(Object.fromEntries(response.data.map((label) => [label.id, label])));
    });
  }, []);

  useEffectNonNull(
    () => {
      routeToInstance();
    },
    [imageInstanceId, imageInstance?.id],
    [viewerImageInstances]
  );

  useEffectNonNull(
    () => {
      const newImageInstance = viewerImageInstances[imageInstanceId];

      if (imageInstanceId === imageInstance?.id) {
        setImageInstance(newImageInstance, false);
      } else {
        setImageInstance(newImageInstance);
      }
    },
    [],
    [imageInstanceId, viewerImageInstances]
  );

  useEffectNonNull(
    () => {
      loadAnnotationData();
    },
    [],
    [allLabels, viewerAnnotations, imageData]
  );

  useEffectNonNull(
    () => {
      buildViewerObjects();
    },
    [],
    [imageInstance]
  );

  return <></>;
};

export default ViewerDataLoader;
