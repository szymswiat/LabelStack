import { ColDef } from 'ag-grid-community';
import { centeredHeaderRendeder, UserActiveCellRenderer, UserRoleCellRenderer } from '../../cellRenderers';
import EditUserButton from '../../cellRenderers/EditUserButton';

export const columnDefs: ColDef[] = [
  { field: 'id', headerName: 'ID', width: 80, resizable: true, filter: false },
  { field: 'full_name', headerName: 'Full Name', width: 300, minWidth: 200, resizable: true },
  { field: 'email', headerName: 'Email', width: 300, minWidth: 200, resizable: true },
  {
    field: 'roles',
    headerName: 'Roles',
    width: 300,
    minWidth: 200,
    resizable: true,
    cellRenderer: UserRoleCellRenderer
  },
  {
    field: 'is_active',
    headerComponent: centeredHeaderRendeder('Is Active'),
    width: 120,
    resizable: true,
    cellRenderer: UserActiveCellRenderer
  },
  {
    field: 'edit_user',
    headerComponent: centeredHeaderRendeder('Edit'),
    width: 120,
    resizable: true,
    cellRenderer: EditUserButton,
    filter: false
  }
];
