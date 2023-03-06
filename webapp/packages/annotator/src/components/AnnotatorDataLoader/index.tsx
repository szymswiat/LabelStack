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

interface AnnotatorDataLoaderProps {
  taskId: number;
  imageInstanceId?: number;
}

const AnnotatorDataLoader: React.FC<AnnotatorDataLoaderProps> = ({ taskId, imageInstanceId }) => {
  const navigate = useNavigate();
  const [{ token }] = useUserDataContext();

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

  useEffect(() => {
    api
      .getTasks(token, taskId)
      .then((response) => {
        const task = response.data[0];
        if (task.status === TaskStatus.done || task.status === TaskStatus.cancelled) {
          navigate('/error', { state: { message: 'Task is already completed.' } });
          return;
        }
        api.getAvailableStatusesForTask(token, task).then((response) => {
          setTask(task);
          setAvailableTaskStatuses(response.data.statuses);
        });
      })
      .catch((reason) => {
        const message = reason.response.data.detail;
        navigate('/error', { state: { message } });
      });
  }, [taskId, taskTrigger]);

  useEffect(() => {
    if (!task) {
      return;
    }
    api.getImageInstancesForTask(token, task.id as number).then((response) => {
      const imageInstances = response.data;
      const newTaskImageInstances = Object.fromEntries(imageInstances.map((instance) => [instance.id, instance]));
      setTaskImageInstances(newTaskImageInstances);
      if (taskObjectsTrigger === 0) {
        routeToInstance(newTaskImageInstances);
      }
    });
    // TODO: called twice on task status change (triggered by separate changes of both dependencies)
  }, [taskObjectsTrigger, task]);

  useEffect(() => {
    routeToInstance();
  }, [imageInstanceId, imageInstance?.id]);

  useEffect(() => {
    api.getLabels(token).then((response) => {
      setAllLabels(Object.fromEntries(response.data.map((label) => [label.id, label])));
    });
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
