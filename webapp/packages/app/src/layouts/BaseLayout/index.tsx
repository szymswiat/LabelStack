import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';

interface ILayoutProps {
  children?: ReactNode;
}

const BaseLayout = ({ children }: ILayoutProps) => {
  return <>{children || <Outlet />}</>;
};

BaseLayout.propTypes = {
  children: PropTypes.node
};

export default BaseLayout;
