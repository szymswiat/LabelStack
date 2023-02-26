import React from 'react';

import { GridApi } from 'ag-grid-community';
import { User, api, ImageInstance, Task, TaskStatus, TaskType } from '@labelstack/api';
import { showNotificationWithApiError, showSuccessNotification } from '../../../../utils';
import CreateTaskForm, { CreateTaskFunction } from '../CreateTaskForm';
import { useUserDataContext } from '../../../../contexts/UserDataContext';

interface CreateLabelTaskFormProps {
  annotators: User[];
  selectedImages: ImageInstance[];

  gridApi: GridApi;
  reloadImages: () => void;
}

const CreateLabelTaskForm: React.FC<CreateLabelTaskFormProps> = ({
  annotators,
  selectedImages,
  gridApi,
  reloadImages
}) => {
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

    if (isGenericFormValid() && isFormValidTaskSpecific) {
      const newTask: Task = {
        assigned_user_id: annotatorId,
        status: annotatorId ? TaskStatus.open : TaskStatus.unassigned,
        total_time: 0,
        task_type: TaskType.labelAssignment,
        name: taskName,
        description: description,
        priority: priority,
        image_instance_ids: selectedImages.map((image) => image.id)
      };

      api
        .createTask(token, newTask)
        .then((_) => {
          const form = e.target as HTMLFormElement;
          form.reset();
          clearForm();
          showSuccessNotification(undefined, 'Task created successfully!');
          reloadImages();
          if (gridApi) gridApi.deselectAll();
        })
        .catch((error) => {
          showNotificationWithApiError(error);
        });
    }
  };

  function isFormValidTaskSpecific() {
    return !(selectedImages === undefined || selectedImages.length <= 0);
  }

  return <CreateTaskForm annotators={annotators} createTask={createTask} />;
};

export default CreateLabelTaskForm;
