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

  async function getUserById() {
    if (userId != null) {
      const { data: responseUser } = await api.getUser(token, userId);
      setUserToUpdate(responseUser);
    }
  }

  async function getRoles() {
    const { data: responseRoles } = await api.getRoles(token);
    setRoles(responseRoles);
  }

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
