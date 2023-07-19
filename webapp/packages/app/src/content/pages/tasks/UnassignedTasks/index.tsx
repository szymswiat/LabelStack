import React, { useEffect, useState } from 'react';

import { api, RoleType, Task, TaskStatus } from '@labelstack/api';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import TableLayout from '../../../../layouts/TableLayout';
import TasksTable from '../../../../components/tables/TasksTable';

export interface UnassignedTasksProps {}

const UnassignedTasks: React.FC<UnassignedTasksProps> = ({}) => {
  const [{ token, user }] = useUserDataContext();
  const [tasks, setTasks] = useState<Task[] | null>(null);

  async function loadTasks() {
    const isSuperuser = user.roles.map((role) => role.type).includes(RoleType.superuser);
    const { data: tasks } = await api.getTasks(token, undefined, TaskStatus.unassigned, undefined, !isSuperuser);
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
