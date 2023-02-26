import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router';

import { api, User } from '@labelstack/api';
import { useUserDataContext } from '../../../contexts/UserDataContext';
import { useQuery } from '../../../utils/hooks';
import ManageUserForm, { ManageUserFormMode } from '../../../components/Forms/Users/ManageUserForm';

const EditUser = () => {
  const [{ token }] = useUserDataContext();
  const query = useQuery();
  const [userId, setUserId] = useState<number>();
  const [user, setUser] = useState<User>({} as User);

  if (query.has('userId') === false) {
    return <Navigate to={'/error'} state={{ message: 'Missing userId. Cannot launch annotator.' }} />;
  }

  useEffect(() => {
    setUserId(Number(query.get('userId')));
  }, []);

  useEffect(() => {
    if (userId != null) {
      api.getUser(token, userId).then((response) => {
        setUser(response.data as User);
      });
    }
  }, [userId]);

  useEffect(() => {
    if (user != null) {
    }
  }, [user]);

  return <ManageUserForm mode={ManageUserFormMode.UPDATE} userToUpdate={user} />;
};

export default EditUser;
