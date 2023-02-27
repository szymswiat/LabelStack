import React, { useEffect, useState } from 'react';

import { api, Role, RoleType, Task } from '@labelstack/api';
import { useUserDataContext } from '../../../contexts/UserDataContext';
import RightBarLayout from '../../../layouts/RightBarLayout';
import TasksTable from '../../../components/Tables/TasksTable';

export interface AllTasksProps {}

const AllTasks: React.FC<AllTasksProps> = ({}) => {
  const [{ user, token }] = useUserDataContext();
  const [tasks, setTasks] = useState<Task[] | null>(null);

  async function loadTasks() {
    const userRoles: string[] = user.roles.map((role: Role) => role.type);
    const forMe = !userRoles.containsAny([RoleType.superuser, RoleType.taskAdmin]);

    const { data: tasks } = await api.getTasks(token, undefined, undefined, undefined, forMe);
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
      <TasksTable refreshTasks={loadTasks} tasks={tasks} />
    </RightBarLayout>
  );
};

export default AllTasks;
