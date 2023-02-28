import React from 'react';
import { User } from '@labelstack/api';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import { columnDefs } from './columnDefs';
import { defaultColDef } from '../helpers';

interface UsersTableProps {
  users: User[];
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {

  return (
    <AgGridReact
      rowData={users}
      defaultColDef={defaultColDef}
      columnDefs={columnDefs}
      className="ag-theme-alpine-dark w-full full"
    />
  );
};

export default UsersTable;
