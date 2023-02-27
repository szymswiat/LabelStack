import React, { useEffect, useState } from 'react';
import { useUserDataContext } from '../../../../contexts/UserDataContext';

import ManageUserForm, { ManageUserFormMode } from '../../../../components/Forms/Users/ManageUserForm';
import { api, Role } from '@labelstack/api';

const CreateUser = () => {
  const [{ token }] = useUserDataContext();
  const [roles, setRoles] = useState<Role[]>([]);

  const getRoles = () => {
    api.getRoles(token).then((response) => {
      setRoles(response.data as Role[]);
    });
  };

  useEffect(() => {
    getRoles();
  }, []);

  return <ManageUserForm mode={ManageUserFormMode.CREATE} roles={roles} />;
};

export default CreateUser;
