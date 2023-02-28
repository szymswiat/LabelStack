import React from 'react';

export interface TableLayoutProps {
  children?: React.ReactNode;
}

const TableLayout: React.FC<TableLayoutProps> = ({ children }) => {
  return <div className="h-full w-full py-1">{children}</div>;
};

export default TableLayout;
