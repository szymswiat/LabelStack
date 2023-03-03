import React from 'react';

import { GridApi } from 'ag-grid-community';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import { api, User, LabelAssignment, Task, TaskStatus, TaskType } from '@labelstack/api';
import { showSuccessNotification, showNotificationWithApiError } from '../../../../utils';
import CreateTaskForm, { CreateTaskFunction } from '../CreateTaskForm';

interface CreateAnnotateTaskFormProps {
  annotators: User[];
  selectedLabelAssignments: LabelAssignment[];

  gridApi: GridApi;
  reloadLabelAssignments: () => void;
}

const CreateAnnotateTaskForm: React.FC<CreateAnnotateTaskFormProps> = ({
  annotators,
  selectedLabelAssignments,
  gridApi,
  reloadLabelAssignments
}) => {
  const [{ token }] = useUserDataContext();

  const createTask: CreateTaskFunction = async ({
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
        task_type: TaskType.annotation,
        name: taskName,
        description: description,
        priority: priority,
        image_instance_ids: selectedLabelAssignments.map((labelAssignment) => labelAssignment.image_instance_id),
        label_assignment_ids: selectedLabelAssignments.map((labelAssignment) => labelAssignment.id),
        annotation_ids: []
      };

      try {
        await api.createTask(token, newTask);
        const form = e.target as HTMLFormElement;
        form.reset();
        clearForm();
        showSuccessNotification(undefined, 'Task created successfully!');
        reloadLabelAssignments();
        if (gridApi) gridApi.deselectAll();
      } catch (error) {
        showNotificationWithApiError(error);
      }
    }
  };

  function isFormValidTaskSpecific() {
    return !(selectedLabelAssignments === undefined || selectedLabelAssignments.length <= 0);
  }

  return <CreateTaskForm annotators={annotators} createTask={createTask} />;
};

export default CreateAnnotateTaskForm;
