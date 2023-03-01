import React, { useEffect, useState } from 'react';

import { api, User, Role } from '@labelstack/api';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import { useQuery } from '../../../../utils/hooks';
import ManageUserForm, { ManageUserFormMode } from '../../../../components/Forms/Users/ManageUserForm';
import EmptyLayout from '../../../../layouts/EmptyLayout';

const EditUser = () => {
  const [{ user, token }] = useUserDataContext();
  const query = useQuery();
  const [userId, setUserId] = useState<number>();
  const [userToUpdate, setUserToUpdate] = useState<User>();
  const [roles, setRoles] = useState<Role[]>([]);

  const getUserById = () => {
    if (userId != null) {
      api.getUser(token, userId).then((response) => {
        setUserToUpdate(response.data as User);
      });
    }
  };

  const getRoles = () => {
    api.getRoles(token).then((response) => {
      setRoles(response.data as Role[]);
    });
  };

  useEffect(() => {
    getRoles();
    if (query.has('userId') === false) {
      setUserToUpdate(user);
    } else {
      setUserId(Number(query.get('userId')));
    }
  }, []);

  useEffect(() => {
    getUserById();
  }, [userId]);

  return (
    <EmptyLayout>
      <ManageUserForm mode={ManageUserFormMode.UPDATE} roles={roles} userToUpdate={userToUpdate} />
    </EmptyLayout>
  );
};

export default EditUser;
