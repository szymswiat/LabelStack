import React, { useEffect, useState } from 'react';
import { useUserDataContext } from '../../../../contexts/UserDataContext';

import ManageUserForm, { ManageUserFormMode } from '../../../../components/Forms/Users/ManageUserForm';
import { api, Role } from '@labelstack/api';
import EmptyLayout from '../../../../layouts/EmptyLayout';
import { useEffectAsync } from '../../../../utils/hooks';

interface CreateUserProps {}

const CreateUser: React.FC<CreateUserProps> = ({}) => {
  const [{ token }] = useUserDataContext();
  const [roles, setRoles] = useState<Role[]>([]);

  useEffectAsync(async () => {
    const { data: responseRoles } = await api.getRoles(token);
    setRoles(responseRoles);
  }, []);

  return (
    <EmptyLayout>
      <ManageUserForm mode={ManageUserFormMode.CREATE} roles={roles} />
    </EmptyLayout>
  );
};

export default CreateUser;
