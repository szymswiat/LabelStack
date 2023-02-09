import React from 'react';
import { BsExclamationLg, BsFillInfoCircleFill } from 'react-icons/bs';
import { Task, TaskStatus } from '@labelstack/api';

export function shouldShowTaskInProgressAlert(task: Task) {
  if (task.status === TaskStatus.open) {
    return true;
  }
  return false;
}

export const TaskInProgressAlert: React.FC = () => {
  return (
    <div className={'text-amber-500 grid grid-cols-12'}>
      <BsExclamationLg className={'col-start-1 place-self-center col-span-2'} size={30} />
      <div className={`col-start-3 col-span-9 place-self-center`}>
        Change task status to 'In Progress' to unlock controls.
      </div>
    </div>
  );
};

export const NoLabelMapsToShowAlert: React.FC = () => {
  return (
    <div className={'text-dark-text grid grid-cols-12'}>
      <BsFillInfoCircleFill className={'text-dark-accent col-start-1 place-self-center col-span-2 w-8 h-8'} />
      <div className={`col-start-3 col-span-9 place-self-center`}>There are no annotations to show.</div>
    </div>
  );
};
