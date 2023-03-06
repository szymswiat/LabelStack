import React from 'react';
import { TableColumnInfo } from '../../../const/tableHeaders';

interface SelectedItemsTableParams {
  header: string;
  tableColumnInfo: TableColumnInfo[];
  data: any[];
}

const SelectedItemsTable = ({ header, tableColumnInfo, data }: SelectedItemsTableParams) => {
  return (
    <div className="h-full">
      <p className="w-full p-2 text-center text-l font-bold dark:text-primary-light">
        {header} ({data.length}):
      </p>
      <table className="w-full h-full table-fixed text-center dark:text-primary-light">
        <thead className="bg-gray-100 dark:bg-secondary-active">
          <tr key="images_header">
            {tableColumnInfo.map((columnInfo) => {
              return <th key={'header_' + columnInfo.header}>{columnInfo.header}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            return (
              <tr className="hover:bg-gray-200 dark:hover:bg-secondary-dark" key={'data_row_' + rowIndex}>
                {tableColumnInfo.map((cell, cellIndex) => {
                  return (
                    <td className="truncate" key={'data_cell_' + rowIndex + '_' + cellIndex}>
                      {cell.cellRenderer ? cell.cellRenderer(row[cell.field]) : row[cell.field]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SelectedItemsTable;
