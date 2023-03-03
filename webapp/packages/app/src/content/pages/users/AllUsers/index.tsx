import React, { useState } from 'react';

import { api, User } from '@labelstack/api';
import UsersTable from '../../../../components/tables/UsersTable';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import TableLayout from '../../../../layouts/TableLayout';
import { useEffectAsync } from '../../../../utils/hooks';

const AllUsers: React.FC = () => {
  const [{ token }] = useUserDataContext();

  const [users, setUsers] = useState<User[]>([]);

  useEffectAsync(async () => {
    const { data: responseUsers } = await api.getUsers(token);
    setUsers(responseUsers);
  }, []);

  return (
    <TableLayout>
      <UsersTable users={users} />
    </TableLayout>
  );
};

export default AllUsers;
