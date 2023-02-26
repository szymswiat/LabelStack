import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface BaseLayoutProps {
  children?: ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return <>{children || <Outlet />}</>;
};

export default BaseLayout;
