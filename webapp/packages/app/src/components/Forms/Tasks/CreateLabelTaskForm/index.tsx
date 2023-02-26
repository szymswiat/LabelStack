import React from 'react';
import axios, { AxiosError } from 'axios';

import { GridApi } from 'ag-grid-community';
import { User, api, ImageInstance, Task, TaskStatus, TaskType, requestErrorMessageKey } from '@labelstack/api';
import { showDangerNotification, showSuccessNotification } from '../../../../utils';
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
          if (axios.isAxiosError(error)) {
            const axiosError: AxiosError = error;
            showDangerNotification(
              undefined,
              axiosError.response ? axiosError.response.data[requestErrorMessageKey] : ''
            );
          }
        });
    }
  };

  function isFormValidTaskSpecific() {
    return !(selectedImages === undefined || selectedImages.length <= 0);
  }

  return <CreateTaskForm annotators={annotators} createTask={createTask} />;
};

export default CreateLabelTaskForm;
