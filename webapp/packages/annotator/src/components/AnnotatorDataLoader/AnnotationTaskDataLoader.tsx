import React, { useRef } from 'react';

import { useImageDataContext } from '@labelstack/viewer/src/contexts/ImageDataContext';
import { LabelMap, useAnnotationDataContext } from '@labelstack/viewer/src/contexts/AnnotationDataContext';
import { useAnnotatorDataContext } from '@labelstack/annotator/src/contexts/AnnotatorDataContext';
import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';
import { Annotation, AnnotationsObject, api, LabelAssignmentsObject } from '@labelstack/api';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import { LabelMapId, LabelMapsObject } from '@labelstack/viewer/src/contexts/AnnotationDataContext/LabelMap';
import { buildLabelMap, decodeLabelMap } from '@labelstack/viewer/src/utils/labelMapUtils';
import { useEffectNonNull } from '@labelstack/app/src/utils/hooks';

const AnnotationTaskDataLoader: React.FC = () => {
  const [
    {
      task,
      allLabels,
      taskObjects: { taskAnnotations },
      updateTriggers: { taskObjectsTrigger }
    },
    { setTaskLabelAssignments, setTaskAnnotations }
  ] = useAnnotatorDataContext();
  const [{ imageInstance, imageData }] = useImageDataContext();
  const [{ labelMaps }, { setLabelMaps }] = useAnnotationDataContext();
  const [{ token }] = useUserDataContext();
  const prevImageInstanceId = useRef<number | null>(null);

  function buildTaskObjects() {
    const taskLabelAssignments: LabelAssignmentsObject = {};
    const taskAnnotations: AnnotationsObject = {};

    imageInstance.label_assignments.forEach((labelAssignment) => {
      labelAssignment.imageInstance = imageInstance;
      if (task.label_assignment_ids.includes(labelAssignment.id)) {
        taskLabelAssignments[labelAssignment.id] = labelAssignment;
      }
      labelAssignment.annotations.forEach((annotation) => {
        annotation.labelAssignment = labelAssignment;
        if (annotation.parent_task_id === task.id) {
          taskAnnotations[annotation.id] = annotation;
        }
      });
    });

    setTaskLabelAssignments(taskLabelAssignments);
    setTaskAnnotations(taskAnnotations);
  }

  async function loadAnnotationData() {
    if (!imageInstance || !task.label_assignment_ids) {
      return;
    }

    const imageInstanceAnnotations: Annotation[] = [];
    imageInstance.label_assignments.forEach((labelAssignment) => {
      if (labelAssignment.annotations?.length > 0) {
        const annotation = labelAssignment.annotations.at(-1);
        if (!annotation.labelAssignment) {
          return;
        }
        imageInstanceAnnotations.push(annotation);
      }
    });

    let newLabelMaps: LabelMapsObject = prevImageInstanceId.current === imageInstance.id ? labelMaps : {};
    for (const annotation of imageInstanceAnnotations) {
      if (!annotation) {
        continue;
      }

      const editable = annotation.id in taskAnnotations;
      const label = allLabels[annotation.labelAssignment.label_id];
      const annotationData = annotation.data_list.at(-1);

      const newLabelMapId = LabelMapId.create(annotation.id);
      if (newLabelMapId.uniqueId in newLabelMaps) {
        continue;
      }

      let labelMapData: vtkImageData;
      if (annotationData) {
        const { data: encodedLabelMap } = await api.readAnnotationData(
          token,
          annotation,
          annotationData.sequence,
          task.id
        );
        labelMapData = await decodeLabelMap(imageData.vtkImage, encodedLabelMap);
      } else {
        labelMapData = await buildLabelMap(imageData.vtkImage);
      }

      const labelMapToDisplay: LabelMap = {
        id: newLabelMapId,
        name: label.name,
        color: [Math.random(), Math.random(), Math.random()],
        data: labelMapData,
        visibility: editable,
        editable: editable,
        modificationTime: 0
      };

      newLabelMaps[labelMapToDisplay.id.uniqueId] = labelMapToDisplay;
    }
    setLabelMaps(Object.values(newLabelMaps));
    prevImageInstanceId.current = imageInstance.id;
  }

  useEffectNonNull(
    () => {
      loadAnnotationData();
    },
    [],
    [allLabels, taskAnnotations, imageData]
  );

  useEffectNonNull(
    () => {
      buildTaskObjects();
      // TODO: called twice on review option change
    },
    [],
    [taskObjectsTrigger, imageInstance]
  );

  return <></>;
};

export default AnnotationTaskDataLoader;
