import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';

import { api, Task } from '@labelstack/api';
import { useUserDataContext } from '../../../contexts/UserDataContext';
import { showSuccessNotification } from '../../../utils';
import { showNotificationWithApiError } from '../../../utils/notifications';

interface TakeTaskButtonParams extends ICellRendererParams {
  reloadData: () => void;
}

export const TakeTaskButton = (params: TakeTaskButtonParams) => {
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
      className="w-full p-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      Take this task
    </button>
  );
};
