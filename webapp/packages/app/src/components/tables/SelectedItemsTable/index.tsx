import React from 'react';
import { TableColumnInfo } from '../tableHeaders';
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
    <div className="flex flex-col h-full px-4 gap-y-2">
      <div className="w-full p-2 flex flex-row justify-center text-l font-bold">
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
      </div>

      <div className="flex flex-row bg-dark-bg rounded-lg h-8 items-center mb-2">
        {tableColumnInfo.map((columnInfo, index) => (
          <div
            key={`header_${index}`}
            className="text-center font-bold overflow-hidden whitespace-nowrap text-ellipsis"
            style={{ width: `${100 / tableColumnInfo.length}%` }}
          >
            {columnInfo.header}
          </div>
        ))}
      </div>

      {data.map((row, rowIndex) => (
        <div key={`row_${rowIndex}`} className="flex flex-row h-6 items-center divide-x">
          {tableColumnInfo.map((cell, cellIndex) => (
            <div
              key={`header_${cellIndex}`}
              className="text-center overflow-hidden whitespace-nowrap text-ellipsis"
              style={{ width: `${100 / tableColumnInfo.length}%` }}
            >
              {cell.cellRenderer ? cell.cellRenderer({ value: row[cell.field] }) : row[cell.field]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SelectedItemsTable;
