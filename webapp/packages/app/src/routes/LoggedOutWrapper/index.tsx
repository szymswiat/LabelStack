import React, { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useUserDataContext } from '../../contexts/UserDataContext';

interface LoggedOutOnlyWrapperProps {
  children?: ReactNode;
}

const LoggedOutOnlyWrapper: React.FC<LoggedOutOnlyWrapperProps> = ({ children }) => {
  const [{ user }] = useUserDataContext();

  if (user === null || user === undefined) {
    return <>{children}</>;
  }

  return <Navigate to="/images/to-label" />;
};

export default LoggedOutOnlyWrapper;
