import React, { useEffect } from 'react';

import { api } from '@labelstack/api';

import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';

interface UserDataLoaderProps {}

const UserDataLoader: React.FC<UserDataLoaderProps> = ({}) => {
  const [{ token, updatingUser }, { setUser }] = useUserDataContext();

  useEffect(() => {
    if (!token || token === '') {
      setUser(null);
      return;
    }

    api.getMe(token).then((response) => {
      if (200 >= response.status && response.status < 300) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    }).catch(() => {
      setUser(null);
    }).finally(() => {
      updatingUser.current = false;
    });
  }, [token]);

  return <></>;
};

export default UserDataLoader;
