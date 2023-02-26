import React from 'react';
import { User } from '@labelstack/api';
import { usersTableHeader } from '../../../const/tableHeaders';

interface UsersTableParams {
  users: User[];
}

const editUser = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.target['value']);
};

const UsersTable = ({ users }: UsersTableParams) => {
  return (
    <div className="h-full overflow-y-auto">
      <p className="w-full p-2 text-center text-l font-bold dark:text-primary-light">Users</p>
      <table className="w-full h-full table-fixed text-center dark:text-primary-light">
        <thead className="bg-gray-100 dark:bg-secondary-active">
          <tr key="users_header">
            {usersTableHeader.map((columnInfo) => {
              return <th key={'header_' + columnInfo.header}>{columnInfo.header}</th>;
            })}
            <th key="header_edit_button">Edit</th>
          </tr>
        </thead>
        <tbody>
          {users.map((row, rowIndex) => {
            return (
              <tr className="hover:bg-gray-200 dark:hover:bg-secondary-dark" key={'data_row_' + rowIndex}>
                {usersTableHeader.map((cell, cellIndex) => {
                  return (
                    <td className="truncate" key={'data_cell_' + rowIndex + '_' + cellIndex}>
                      {cell.cellRenderer ? cell.cellRenderer(row[cell.field]) : row[cell.field]}
                    </td>
                  );
                })}
                <td className="truncate">
                  <button
                    className="w-8/12 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    value={row['id']}
                    onClick={editUser}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
