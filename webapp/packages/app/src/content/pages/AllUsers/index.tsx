import React, { useEffect, useState } from 'react';

import { api, User } from '@labelstack/api';
import UsersTable from '../../../components/Tables/UsersTable';
import { useUserDataContext } from '../../../contexts/UserDataContext';

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

  return <UsersTable users={users} />;
};

export default AllUsers;
