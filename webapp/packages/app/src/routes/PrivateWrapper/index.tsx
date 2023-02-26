import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import { User, RoleType } from '@labelstack/api';
import { useUserDataContext } from '../../contexts/UserDataContext';

interface PrivateWrapperProps {
  children?: ReactNode;
  roles?: RoleType[];
}

const PrivateWrapper: React.FC<PrivateWrapperProps> = ({ children, roles }) => {
  const [{ user, updatingUser }] = useUserDataContext();
  const location = useLocation();

  const userHasRequiredRole = (user: User) => {
    if (roles === null || roles === undefined) {
      return true;
    } else if (roles.length > 0) {
      const userRoles = user.roles.map((role) => role.type);
      const requiredRoles = roles.map((role) => role.toString());

      return userRoles.containsAny(requiredRoles);
    }

    return false;
  };

  if (user === undefined || updatingUser.current) {
    return <div className="bg-dark-bg" />;
  }

  if (user) {
    if (userHasRequiredRole(user)) {
      return <>{children}</>;
    } else {
      return <Navigate to="/error" state={{ message: "You don't have required permissions to open this page." }} />;
    }
  }

  return <Navigate replace to="/login" state={{ from: location.pathname }} />;
};

export default PrivateWrapper;
