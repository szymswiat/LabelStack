import React, { useEffect } from 'react';

import { api } from '@labelstack/api';

import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';

interface UserDataLoaderProps {
  setUserDataUpdated: (value: boolean) => void;
}

const UserDataLoader: React.FC<UserDataLoaderProps> = ({ setUserDataUpdated }) => {
  const [{ token }, { setUser }] = useUserDataContext();

  useEffect(() => {
    api
      .getMe(token)
      .then((response) => {
        if (200 >= response.status && response.status < 300) {
          setUser(response.data);
        }
      })
      .finally(() => {
        setUserDataUpdated(true);
      });
  }, []);

  return <></>;
};

export default UserDataLoader;
