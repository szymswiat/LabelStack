import React, { useEffect, useState } from 'react';

import { api, Role, RoleType, Task, TaskType } from '@labelstack/api';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import TableLayout from '../../../../layouts/TableLayout';
import TasksTable from '../../../../components/tables/TasksTable';

export interface AnnotationTasksProps {}

const AnnotationTasks: React.FC<AnnotationTasksProps> = ({}) => {
  const [{ user, token }] = useUserDataContext();
  const [tasks, setTasks] = useState<Task[] | null>(null);

  async function loadTasks() {
    const userRoles: string[] = user.roles.map((role: Role) => role.type);
    const forMe = !userRoles.containsAny([RoleType.superuser, RoleType.taskAdmin]);

    const { data: tasks } = await api.getTasks(token, undefined, undefined, TaskType.annotation, forMe);
    setTasks(tasks);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <TableLayout>
      <TasksTable refreshTasks={loadTasks} tasks={tasks} />
    </TableLayout>
  );
};

export default AnnotationTasks;
