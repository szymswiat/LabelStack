import React from 'react';

import { GridApi } from 'ag-grid-community';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import { User, api, Task, TaskStatus, TaskType, Annotation } from '@labelstack/api';
import { showNotificationWithApiError, showSuccessNotification } from '../../../../utils';
import CreateTaskForm, { CreateTaskFunction } from '../CreateTaskForm';

interface CreateAnnotationReviewTaskFormParams {
  annotators: User[];
  selectedAnnotations: Annotation[];

  gridApi: GridApi;
  reloadAnnotations: () => void;
}

const CreateAnnotationReviewTaskForm = ({
  annotators,
  selectedAnnotations,
  gridApi,
  reloadAnnotations
}: CreateAnnotationReviewTaskFormParams) => {
  const [{ token }] = useUserDataContext();

  const createTask: CreateTaskFunction = ({
    e,
    annotatorId,
    taskName,
    description,
    priority,
    isGenericFormValid,
    clearForm
  }) => {
    e.preventDefault();

    if (isGenericFormValid() && isFormValidTaskSpecific()) {
      const newTask: Task = {
        assigned_user_id: annotatorId,
        status: annotatorId ? TaskStatus.open : TaskStatus.unassigned,
        total_time: 0,
        task_type: TaskType.annotationReview,
        name: taskName,
        description: description,
        priority: priority,
        image_instance_ids: [],
        label_assignment_ids: [],
        annotation_ids: selectedAnnotations.map((annotation) => annotation.id)
      };

      api
        .createTask(token, newTask)
        .then((_) => {
          const form = e.target as HTMLFormElement;
          form.reset();
          clearForm();
          showSuccessNotification(undefined, 'Task created successfully!');
          reloadAnnotations();
          if (gridApi) gridApi.deselectAll();
        })
        .catch((error) => {
          showNotificationWithApiError(error);
        });
    }
  };

  function isFormValidTaskSpecific() {
    return !(selectedAnnotations === undefined || selectedAnnotations.length <= 0);
  }

  return <CreateTaskForm annotators={annotators} createTask={createTask} />;
};

export default CreateAnnotationReviewTaskForm;
