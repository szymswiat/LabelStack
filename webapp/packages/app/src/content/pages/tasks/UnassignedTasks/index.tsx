import React, { useEffect, useState } from 'react';

import { api, Task, TaskStatus } from '@labelstack/api';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import RightBarLayout from '../../../../layouts/RightBarLayout';
import TasksTable from '../../../../components/Tables/TasksTable';

export interface UnassignedTasksProps {}

const UnassignedTasks: React.FC<UnassignedTasksProps> = ({}) => {
  const [{ token }] = useUserDataContext();
  const [tasks, setTasks] = useState<Task[] | null>(null);

  async function loadTasks() {
    const { data: tasks } = await api.getTasks(token, undefined, TaskStatus.unassigned, undefined, false);
    setTasks(tasks);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function renderRightBarComponent(): React.ReactNode {
    return <></>;
  }

  return (
    <RightBarLayout rightBarComponent={renderRightBarComponent()}>
      <TasksTable refreshTasks={loadTasks} tasks={tasks} unassigned={true} />
    </RightBarLayout>
  );
};

export default UnassignedTasks;
