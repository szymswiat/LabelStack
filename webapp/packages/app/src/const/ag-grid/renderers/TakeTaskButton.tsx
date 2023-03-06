import React from 'react';
import axios, { AxiosError } from 'axios';
import { ICellRendererParams } from 'ag-grid-community';

import { api, requestErrorMessageKey, Task } from '@labelstack/api';
import { useUserDataContext } from '../../../contexts/UserDataContext';
import { showDangerNotification, showSuccessNotification } from '../../../utils';

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
        if (axios.isAxiosError(error)) {
          const axiosError: AxiosError = error;
          showDangerNotification(
            undefined,
            axiosError.response ? axiosError.response.data[requestErrorMessageKey] : ''
          );
        }
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
