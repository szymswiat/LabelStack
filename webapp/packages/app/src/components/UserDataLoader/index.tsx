import React, { useEffect } from 'react';

import { api } from '@labelstack/api';

import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';
import { useEffectAsync } from '../../utils/hooks';

interface UserDataLoaderProps {}

const UserDataLoader: React.FC<UserDataLoaderProps> = ({}) => {
  const [{ token, updatingUser, userReloadTrigger }, { setUser }] = useUserDataContext();

  useEffectAsync(async () => {
    if (!token || token === '') {
      setUser(null);
      return;
    }

    try {
      const response = await api.getMe(token);
      if (200 >= response.status && response.status < 300) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (reason) {
      setUser(null);
    } finally {
      updatingUser.current = false;
    }

  }, [token, userReloadTrigger]);

  return <></>;
};

export default UserDataLoader;
