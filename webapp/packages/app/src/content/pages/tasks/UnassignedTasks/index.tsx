import React, { useEffect, useState } from 'react';

import { api, Task, TaskStatus } from '@labelstack/api';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import TableLayout from '../../../../layouts/TableLayout';
import TasksTable from '../../../../components/tables/TasksTable';

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

  return (
    <TableLayout>
      <TasksTable refreshTasks={loadTasks} tasks={tasks} unassigned={true} />
    </TableLayout>
  );
};

export default UnassignedTasks;
