import React, { createContext, ReactNode, useContext, useRef, useState } from 'react';
import { User } from '@labelstack/api';
import { useLocalStorage } from '../../utils/hooks';
import reactUseCookie from 'react-use-cookie';

export interface UserDataContext {
  state: UserDataState;
  api: UserDataApi;
}

interface UserDataState {
  user: User;
  token: string | undefined;
  updatingUser: React.MutableRefObject<boolean>;
  userReloadTrigger: number;
}

interface UserDataApi {
  setUser: (user: User | null | undefined) => void;
  setToken: (token: string | undefined) => void;
  reloadUserData: () => void;
}

export const UserDataContext = createContext<[UserDataState, UserDataApi]>(null);

export const UserDataProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const updatingUser = useRef<boolean>(false);
  const [token, setTokenState] = reactUseCookie('token', '');
  const [userReloadTrigger, setUserReloadTrigger] = useState<number>(Date.now());

  function reloadUserData() {
    setUserReloadTrigger(Date.now());
  }

  const state: UserDataState = {
    user,
    token,
    updatingUser,
    userReloadTrigger
  };

  function setToken(token: string) {
    setTokenState(token, { path: '/' });
  }

  const api: UserDataApi = {
    setUser,
    setToken,
    reloadUserData
  };

  return <UserDataContext.Provider value={[state, api]}>{children}</UserDataContext.Provider>;
};

export const useUserDataContext = () => useContext(UserDataContext);
