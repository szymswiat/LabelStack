import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router';

import { api, User, Role } from '@labelstack/api';
import { useUserDataContext } from '../../../contexts/UserDataContext';
import { useQuery } from '../../../utils/hooks';
import ManageUserForm, { ManageUserFormMode } from '../../../components/Forms/Users/ManageUserForm';

const EditUser = () => {
  const [{ token }] = useUserDataContext();
  const query = useQuery();
  const [userId, setUserId] = useState<number>();
  const [user, setUser] = useState<User>();
  const [roles, setRoles] = useState<Role[]>([]);

  if (query.has('userId') === false) {
    return <Navigate to={'/error'} state={{ message: 'Missing userId. Cannot launch annotator.' }} />;
  }

  const getUserById = () => {
    if (userId != null) {
      api.getUser(token, userId).then((response) => {
        setUser(response.data as User);
      });
    }
  };

  const getRoles = () => {
    api.getRoles(token).then((response) => {
      setRoles(response.data as Role[]);
    });
  };

  useEffect(() => {
    setUserId(Number(query.get('userId')));
  }, []);

  useEffect(() => {
    getUserById();
    getRoles();
  }, [userId]);

  useEffect(() => {
    if (user != null) {
    }
  }, [user]);

  return <ManageUserForm mode={ManageUserFormMode.UPDATE} roles={roles} userToUpdate={user} />;
};

export default EditUser;
