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
    <div className={'flex text-sm flex-col gap-y-1'}>
      <div>
        Status: <span className={'font-bold text-dark-accent'}>{taskStatusRepresentation[task.status]}</span>
      </div>
      {availableTaskStatuses.length > 0 && (
        <>
          <div>Move to:</div>
          <div className={'flex flex-row w-full h-10 gap-x-2 mt-2'}>
            {availableTaskStatuses?.map((status) => (
              <div key={status} className={'h-8'}>
                <PanelButton
                  name={taskStatusRepresentation[status]}
                  isActive={false}
                  onClick={() => changeTaskStatus(status)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskStatusControl;
