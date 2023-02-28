import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface BaseLayoutProps {
  children?: ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return <div className="w-full h-full bg-dark-bg text-dark-text">{children || <Outlet />}</div>;
};

export default BaseLayout;
