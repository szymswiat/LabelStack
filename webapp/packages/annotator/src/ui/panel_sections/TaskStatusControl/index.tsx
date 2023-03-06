import React from 'react';
import { useAnnotatorDataContext } from '../../../contexts/AnnotatorDataContext';
import { api, taskStatusRepresentation } from '@labelstack/api';
import PanelButton from '@labelstack/viewer/src/ui/components/PanelButton';
import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';
import { showWarningNotification } from '@labelstack/app/src/utils';

interface TaskStatusControlProps {}

const TaskStatusControl: React.FC<TaskStatusControlProps> = () => {
  const [{ task, availableTaskStatuses }, { refreshTask, refreshTaskObjects }] = useAnnotatorDataContext();
  const [{ token }] = useUserDataContext();

  function changeTaskStatus(status: number) {
    api
      .changeTaskStatus(token, task.id, status)
      .then((response) => {
        refreshTask();
        refreshTaskObjects();
      })
      .catch((reason) => {
        showWarningNotification('Warning', reason.response.data.detail);
      });
  }

  return (
    <div className={'flex flex-col gap-y-2'}>
      <div>
        Current status: <span className={'font-bold'}>{taskStatusRepresentation[task.status]}</span>
      </div>
      <div>Change status to:</div>
      <div className={'flex flex-row w-full h-12 gap-x-2'}>
        {availableTaskStatuses?.map((status) => (
          <div key={status} className={'h-10'}>
            <PanelButton
              name={taskStatusRepresentation[status]}
              isActive={false}
              onClick={() => changeTaskStatus(status)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskStatusControl;
