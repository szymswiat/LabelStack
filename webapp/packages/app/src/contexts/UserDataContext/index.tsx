import React, { createContext, ReactNode, useContext, useState } from 'react';
import { IUserProfile } from '@labelstack/api';
import { useLocalStorage } from '../../utils/hooks';

export interface IUserDataContext {
  state: UserDataState;
  api: UserDataApi;
}

interface UserDataState {
  user: IUserProfile;
  token: string;
}

interface UserDataApi {
  setUser: (user: IUserProfile) => void;
  setToken: (token: string) => void;
}

export const UserDataContext = createContext<[UserDataState, UserDataApi]>(null);

export const UserDataProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [token, setTokenState] = useLocalStorage<string>('token', '');

  const state: UserDataState = {
    user,
    token
  };

  function setToken(token: string) {
    localStorage.setItem('token', token);
    setTokenState(token);
  }

  const api: UserDataApi = {
    setUser,
    setToken
  };

  return <UserDataContext.Provider value={[state, api]}>{children}</UserDataContext.Provider>;
};

export const useUserDataContext = () => useContext(UserDataContext);
