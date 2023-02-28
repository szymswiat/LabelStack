import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

interface SidebarLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarLayout: React.FC<SidebarLayoutProps> = () => {
  return (
    <div className="flex flex-row gap-4 h-screen no-scrollbar p-4">
      <div className="basis-1/6 overflow-y-auto">
        <Sidebar />
      </div>
      <div className="basis-5/6">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
