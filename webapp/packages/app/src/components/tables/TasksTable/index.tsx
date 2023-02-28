import React, { useEffect, useState } from 'react';

import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

import {
  api,
  User,
  RoleType,
  Task,
  taskPriorityRepresentation,
  taskStatusRepresentation,
  taskTypeRepresentation
} from '@labelstack/api';

import { taskColumnDefs, unassignedTaskColumnDefs } from './columnDefs';
import { useUserDataContext } from '../../../contexts/UserDataContext';
import { useEffectNonNull } from '../../../utils/hooks';
import { defaultColDef } from '../helpers';

interface TasksTableProps {
  tasks: Task[];
  refreshTasks: () => void;
  unassigned?: boolean;
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks, unassigned, refreshTasks }) => {
  const [{ user, token }] = useUserDataContext();
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

  const setColumnDefinitions = () => {
    let colDefs: ColDef[] = unassigned
      ? unassignedTaskColumnDefs.map((columnDef) => {
          return columnDef;
        })
      : taskColumnDefs;

    colDefs = colDefs.map((columnDef) => {
      if (columnDef.field == 'take_task') {
        columnDef.cellRendererParams = { reloadData: refreshTasks };
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
    loadUsers();
  }, [unassigned]);

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
    <AgGridReact
      rowData={tasks}
      defaultColDef={defaultColDef}
      columnDefs={columnDefs}
      className="ag-theme-alpine-dark w-full full"
    />
  );
};

export default TasksTable;
