import React, { useEffect, useState } from 'react';

import { api, User } from '@labelstack/api';
import UsersTable from '../../../../components/tables/UsersTable';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import TableLayout from '../../../../layouts/TableLayout';

const AllUsers = () => {
  const [{ token }] = useUserDataContext();

  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = () => {
    api.getUsers(token).then((response) => {
      const responseUsers = response.data as User[];
      setUsers(responseUsers);
    });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <TableLayout>
      <UsersTable users={users} />
    </TableLayout>
  );
};

export default AllUsers;
