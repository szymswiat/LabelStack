import { ColDef } from 'ag-grid-community';
import { CustomFilter } from '../../cellFilters/CustomFilter';
import {
  TaskPriorityCellRenderer,
  TaskStatusCellRenderer,
  TaskTypeCellRenderer,
  UserCellRenderer
} from '../../cellRenderers';
import OpenTaskButton from '../../cellRenderers/OpenTaskButton';
import TakeTaskButton from '../../cellRenderers/TakeTaskButton';

export const taskColumnDefs: ColDef[] = [
  {
    field: 'open_task',
    headerName: 'Open Task',
    cellRenderer: OpenTaskButton,
    width: 100,
    minWidth: 100,
    maxWidth: 100
  },
  { field: 'id', headerName: 'ID', width: 100, minWidth: 100, resizable: true },
  {
    field: 'assigned_user_id',
    headerName: 'Assigned User',
    cellRenderer: UserCellRenderer,
    filter: CustomFilter,
    width: 200,
    minWidth: 200,
    resizable: true
  },
  {
    field: 'task_type',
    headerName: 'Task Type',
    cellRenderer: TaskTypeCellRenderer,
    filter: CustomFilter,
    width: 150,
    minWidth: 150,
    resizable: true
  },
  {
    field: 'status',
    headerName: 'Status',
    cellRenderer: TaskStatusCellRenderer,
    filter: CustomFilter,
    width: 150,
    minWidth: 150,
    resizable: true
  },
  { field: 'total_time', headerName: 'Total Time', width: 200, minWidth: 200, resizable: true },
  { field: 'name', headerName: 'Name', width: 200, minWidth: 200, resizable: true },
  { field: 'description', headerName: 'Description', width: 200, minWidth: 200, resizable: true },
  {
    field: 'priority',
    headerName: 'Priority',
    cellRenderer: TaskPriorityCellRenderer,
    filter: CustomFilter,
    width: 150,
    minWidth: 150,
    resizable: true
  }
];

export const unassignedTaskColumnDefs: ColDef[] = [
  {
    field: 'take_task',
    headerName: 'Take Task',
    cellRenderer: TakeTaskButton,
    width: 180,
    minWidth: 180,
    maxWidth: 180
  },
  { field: 'id', headerName: 'ID', width: 100, minWidth: 100, resizable: true },
  {
    field: 'assigned_user_id',
    headerName: 'Assigned User',
    cellRenderer: UserCellRenderer,
    filter: CustomFilter,
    width: 200,
    minWidth: 200,
    resizable: true
  },
  {
    field: 'task_type',
    headerName: 'Task Type',
    cellRenderer: TaskTypeCellRenderer,
    filter: CustomFilter,
    width: 150,
    minWidth: 150,
    resizable: true
  },
  {
    field: 'status',
    headerName: 'Status',
    cellRenderer: TaskStatusCellRenderer,
    filter: CustomFilter,
    width: 150,
    minWidth: 150,
    resizable: true
  },
  { field: 'total_time', headerName: 'Total Time', width: 200, minWidth: 200, resizable: true },
  { field: 'name', headerName: 'Name', width: 200, minWidth: 200, resizable: true },
  { field: 'description', headerName: 'Description', width: 200, minWidth: 200, resizable: true },
  {
    field: 'priority',
    headerName: 'Priority',
    cellRenderer: TaskPriorityCellRenderer,
    filter: CustomFilter,
    width: 150,
    minWidth: 150,
    resizable: true
  }
];
