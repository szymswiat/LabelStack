import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import LayoutCard from '@labelstack/viewer/src/ui/components/LayoutCard';

interface SidebarLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarLayout: React.FC<SidebarLayoutProps> = () => {
  return (
    <div className="flex flex-row gap-4 h-screen no-scrollbar p-4">
      <LayoutCard className="w-[20rem] overflow-y-auto">
        <Sidebar />
      </LayoutCard>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
