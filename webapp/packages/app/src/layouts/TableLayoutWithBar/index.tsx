import LayoutCard from '@labelstack/viewer/src/ui/components/LayoutCard';
import React from 'react';

export interface TableLayoutWithBarProps {
  children?: React.ReactNode;
  rightBarComponent: React.ReactNode;
}

const TableLayoutWithBar: React.FC<TableLayoutWithBarProps> = ({ children, rightBarComponent }) => {
  return (
    <div className="flex flex-row h-full w-full gap-x-4">
      <div className="flex-grow py-1">{children}</div>
      <LayoutCard className="h-full w-[30rem] p-4">
        <div className="h-full overflow-y-scroll no-scrollbar">{rightBarComponent}</div>
      </LayoutCard>
    </div>
  );
};

export default TableLayoutWithBar;
