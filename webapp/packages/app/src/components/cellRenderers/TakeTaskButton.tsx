import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';

import { api, Task } from '@labelstack/api';
import { useUserDataContext } from '../../contexts/UserDataContext';
import { showNotificationWithApiError, showSuccessNotification } from '../../utils';

interface TakeTaskButtonProps extends ICellRendererParams {
  reloadData: () => void;
}

const TakeTaskButton: React.FC<TakeTaskButtonProps> = (params) => {
  const [{ user, token }] = useUserDataContext();

  const assignTaskToCurrentUser = () => {
    const task = params.data as Task;

    api
      .changeTaskOwner(token, task.id, user.id)
      .then(() => {
        showSuccessNotification(undefined, 'Task assigned successfully!');
        params.reloadData();
      })
      .catch((error) => {
        showNotificationWithApiError(error);
      });
  };

  return (
    <button
      onClick={assignTaskToCurrentUser}
      className="w-full p-1 font-medium rounded-lg text-sm text-center text-dark-accent bg-dark-card-bg"
    >
      Take this task
    </button>
  );
};

export default TakeTaskButton;
