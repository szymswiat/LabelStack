import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

interface SidebarLayoutProps {
  children?: ReactNode;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  return (
    <div className="flex flex-row h-screen no-scrollbar bg-white dark:bg-primary-dark">
      <div className="basis-1/6 overflow-y-auto py-4 px-3 rounded">
        <Sidebar />
      </div>
      <div className="basis-5/6">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
