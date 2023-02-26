import React, { useEffect, useState } from 'react';

import { AxiosResponse } from 'axios';

import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

import {
  api,
  User,
  Role,
  RoleType,
  Task,
  taskPriorityRepresentation,
  TaskStatus,
  taskStatusRepresentation,
  TaskType,
  taskTypeRepresentation
} from '@labelstack/api';

import { defaultColDef, taskColumnDefs, unassignedTaskColumnDefs } from '../../../const/ag-grid/columnDefs';
import { useUserDataContext } from '../../../contexts/UserDataContext';
import { useEffectNonNull } from '../../../utils/hooks';

interface TasksTableParams {
  taskType: TaskType;
  unassigned?: boolean;
}

const TasksTable = ({ taskType, unassigned }: TasksTableParams) => {
  const [{ user, token }] = useUserDataContext();
  const [tasks, setTasks] = useState<Task[]>();
  const [users, setUsers] = useState<User[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

  async function loadUsers() {
    const currentUserRoleTypes = user.roles.map((role) => role.type);
    if (!currentUserRoleTypes.containsAny([RoleType.dataAdmin, RoleType.superuser, RoleType.taskAdmin])) {
      setUsers([user]);
    } else {
      const { data: allUsers } = await api.getUsers(token);
      setUsers(allUsers);
    }
  }

  const loadTasks = () => {
    const userRoles: string[] = user.roles.map((role: Role) => role.type);
    const forMe = userRoles.includes(RoleType.annotator.toString()) ? true : false;

    (unassigned
      ? api.getTasks(token, undefined, TaskStatus.unassigned, taskType, false)
      : api.getTasks(token, undefined, undefined, taskType, forMe)
    ).then((response: AxiosResponse) => {
      const responseTasks = response.data as Task[];
      setTasks(responseTasks);
    });
  };

  const setColumnDefinitions = () => {
    let colDefs: ColDef[] = unassigned
      ? unassignedTaskColumnDefs.map((columnDef) => {
          return columnDef;
        })
      : taskColumnDefs;

    colDefs = colDefs.map((columnDef) => {
      if (columnDef.field == 'take_task') {
        columnDef.cellRendererParams = { reloadData: loadTasks };
      } else if (columnDef.field == 'assigned_user_id') {
        columnDef.cellRendererParams = { users: users };
        columnDef.filterParams = {
          entries: users.map((user) => {
            return { label: user.email, id: user.id };
          }),
          compareIdFn: (row: any, ids: number[]) => {
            if (row.assigned_user_id != undefined && ids.includes(row.assigned_user_id)) return true;
            return false;
          }
        };
      } else if (columnDef.field == 'task_type') {
        columnDef.filterParams = {
          entries: Object.entries(taskTypeRepresentation).map(([key, value]) => {
            return { label: value, id: key };
          }),
          compareIdFn: (row: any, ids: number[]) => {
            if (row.task_type != undefined && ids.includes(row.task_type)) return true;
            return false;
          }
        };
      } else if (columnDef.field == 'status') {
        columnDef.filterParams = {
          entries: Object.entries(taskStatusRepresentation).map(([key, value]) => {
            return { label: value, id: key };
          }),
          compareIdFn: (row: any, ids: number[]) => {
            if (row.status != undefined && ids.includes(row.status)) return true;
            return false;
          }
        };
      } else if (columnDef.field == 'priority') {
        columnDef.filterParams = {
          entries: Object.entries(taskPriorityRepresentation).map(([key, value]) => {
            return { label: value, id: key };
          }),
          compareIdFn: (row: any, ids: number[]) => {
            if (row.priority != undefined && ids.includes(row.priority)) return true;
            return false;
          }
        };
      }
      return columnDef;
    });

    setColumnDefs(colDefs);
  };

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, [taskType, unassigned]);

  useEffectNonNull(
    () => {
      if (users.length > 0) {
        setColumnDefinitions();
      }
    },
    [],
    [users]
  );

  return (
    <div className="flex flex-row h-full w-full overflow-auto">
      <div className="w-full ag-theme-alpine-dark">
        <AgGridReact rowData={tasks} defaultColDef={defaultColDef} columnDefs={columnDefs} />
      </div>
    </div>
  );
};

export default TasksTable;
