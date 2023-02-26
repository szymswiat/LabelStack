import React from 'react';
import { TableColumnInfo } from '../../../const/tableHeaders';
import { IoMdOpen } from 'react-icons/io';
import classNames from 'classnames';
import PanelButton from '@labelstack/viewer/src/ui/components/PanelButton';

interface SelectedItemsTableProps {
  header: string;
  tableColumnInfo: TableColumnInfo[];
  data: any[];
  isImageList?: boolean;
}

const SelectedItemsTable: React.FC<SelectedItemsTableProps> = ({
  header,
  tableColumnInfo,
  data,
  isImageList = false
}) => {
  function openViewerWithImages() {
    if (data.length === 0) {
      return;
    }
    const imageIds = data.map((image) => image.id);
    window.open(`/viewer?imageInstanceIds=${imageIds.join(',')}`);
  }

  return (
    <div className="h-full px-4">
      <p className="w-full p-2 flex flex-row justify-center text-l font-bold">
        {isImageList && (
          <PanelButton
            name="Open selected images"
            border={false}
            icon={IoMdOpen}
            isActive={false}
            iconClassName="w-6 h-6 text-dark-accent"
            onClick={openViewerWithImages}
          />
        )}
        <span className={classNames({ 'pl-2': isImageList })}>
          {header} ({data.length}):
        </span>
      </p>
      <table className="w-full h-full table-fixed text-center">
        <thead className="bg-dark-card-bg rounded-lg">
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
