import React, { useEffect } from 'react';

import { useAnnotatorDataContext } from '@labelstack/annotator/src/contexts/AnnotatorDataContext';
import { api, TaskStatus, TaskType } from '@labelstack/api';
import { useImageDataContext } from '@labelstack/viewer/src/contexts/ImageDataContext';
import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';
import AnnotationTaskDataLoader from './AnnotationTaskDataLoader';
import { useNavigate } from 'react-router';
import AnnotationReviewTaskDataLoader from './AnnotationReviewTaskDataLoader';
import LabelAssignmentTaskDataLoader from './LabelAssignmentTaskDataLoader';
import { ImageInstancesObject } from '@labelstack/api';
import { useAnnotatorLayoutContext } from '../../contexts/AnnotatorLayoutContext';
import { useEditedAnnotationDataContext } from '../../contexts/EditedAnnotationDataContext';
import { useEffectAsync } from '@labelstack/app/src/utils/hooks';

interface AnnotatorDataLoaderProps {
  taskId: number;
  imageInstanceId?: number;
}

const AnnotatorDataLoader: React.FC<AnnotatorDataLoaderProps> = ({ taskId, imageInstanceId }) => {
  const navigate = useNavigate();
  const [{ token }] = useUserDataContext();
  const [, { setEditModeLocked }] = useAnnotatorLayoutContext();
  const [, { setEditedLabelMapId }] = useEditedAnnotationDataContext();

  const [
    {
      task,
      taskObjects,
      updateTriggers: { taskTrigger, taskObjectsTrigger }
    },
    { setTask, setTaskImageInstances, setAllLabels, setAvailableTaskStatuses }
  ] = useAnnotatorDataContext();
  const [{ imageInstance }, { setImageInstance }] = useImageDataContext();
  const { taskImageInstances } = taskObjects;

  function routeToInstance(imageInstancesObject?: ImageInstancesObject) {
    if (!taskImageInstances && !imageInstancesObject) {
      return;
    }
    const imageInstances = Object.values(imageInstancesObject ? imageInstancesObject : taskImageInstances);
    const imageInstanceIdToSet =
      imageInstanceId && imageInstances.map((i) => i.id).includes(imageInstanceId)
        ? imageInstanceId
        : imageInstances[0].id;
    navigate(`?taskId=${taskId}&imageInstanceId=${imageInstanceIdToSet}`);
  }

  useEffectAsync(async () => {
    try {
      const { data: tasks } = await api.getTasks(token, taskId);
      const task = tasks[0];

      setEditModeLocked(task.status !== TaskStatus.inProgress);
      if (task.status !== TaskStatus.inProgress) {
        setEditedLabelMapId(null);
      }

      const { data: statuses } = await api.getAvailableStatusesForTask(token, task);

      setTask(task);
      setAvailableTaskStatuses(statuses.statuses);
    } catch (reason) {
      const message = reason.response.data.detail;
      navigate('/error', { state: { message } });
    }
  }, [taskId, taskTrigger]);

  useEffectAsync(async () => {
    if (!task) {
      return;
    }

    const { data: imageInstances } = await api.getImageInstancesForTask(token, task.id as number);
    const newTaskImageInstances = Object.fromEntries(imageInstances.map((instance) => [instance.id, instance]));
    setTaskImageInstances(newTaskImageInstances);
    if (taskObjectsTrigger === 0) {
      routeToInstance(newTaskImageInstances);
    }
    // TODO: called twice on task status change (triggered by separate changes of both dependencies)
  }, [taskObjectsTrigger, task]);

  useEffect(() => {
    routeToInstance();
  }, [imageInstanceId, imageInstance?.id]);

  useEffectAsync(async () => {
    const { data: labels } = await api.getLabels(token);
    const allLabels = Object.fromEntries(labels.map((label) => [label.id, label]));
    setAllLabels(allLabels);
  }, []);

  useEffect(() => {
    if (imageInstanceId == null || taskImageInstances == null || task == null) {
      return;
    }
    const newImageInstance = taskImageInstances[imageInstanceId];

    if (imageInstanceId === imageInstance?.id) {
      setImageInstance(newImageInstance, false);
    } else {
      setImageInstance(newImageInstance);
    }
  }, [imageInstanceId, taskImageInstances]);

  switch (task?.task_type) {
    case TaskType.labelAssignment:
      return <LabelAssignmentTaskDataLoader />;
    case TaskType.annotation:
      return <AnnotationTaskDataLoader />;
    case TaskType.annotationReview:
      return <AnnotationReviewTaskDataLoader />;
    default:
      return <></>;
  }
};

export default AnnotatorDataLoader;
