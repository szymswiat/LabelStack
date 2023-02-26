import React, { useState } from 'react';

import { api, requestErrorMessageKey } from '@labelstack/api';
import { useUserDataContext } from '../../../contexts/UserDataContext';
import { showDangerNotification, showSuccessNotification } from '../../../utils';
import { useDocumentTitle } from '../../../utils/hooks';
import LayoutCard from '@labelstack/viewer/src/components/LayoutCard';
import { useLocation, useNavigate } from 'react-router';

function Login() {
  const [{ updatingUser }, { setToken }] = useUserDataContext();

  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  const { state } = useLocation();
  const navigate = useNavigate();

  useDocumentTitle('LabelStack');

  const isFormValid = () => {
    if (!username || username === '' || !password || password === '') {
      showDangerNotification(undefined, "Username and password can't be empty!");
      return false;
    }
    return true;
  };

  async function authenticate() {
    if (isFormValid()) {
      try {
        updatingUser.current = true;
        const tokenResponse = await api.logInGetToken(username, password);
        const token = tokenResponse.data.access_token as string;
        setToken(token);
        navigate(state ? state['from'] : '/images/all');
        showSuccessNotification(undefined, 'Successfully logged in!');
      } catch (error) {
        showDangerNotification(undefined, error.response.data[requestErrorMessageKey]);
      }
    }
  }

  const handleEnterPress = (event: any) => {
    if (event.key === 'Enter') {
      authenticate();
    }
  };

  return (
    <div className="w-full h-full bg-dark-bg text-dark-text grid place-items-center">
      <form onKeyUp={handleEnterPress}>
        <LayoutCard className="w-[30rem] h-[20rem] px-20 flex flex-col gap-y-3">
          <input
            className="w-full h-12 rounded-lg bg-dark-bg pl-6 mt-12"
            type="text"
            placeholder="username/email"
            id="username_input"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            className="w-full h-12 rounded-lg bg-dark-bg pl-6 text-dark-text"
            type="password"
            placeholder="password"
            id="password_input"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div className="grid place-items-center flex-grow -mt-3">
            <div
              className="w-2/3 h-12 bg-dark-bg text-dark-accent font-bold grid place-items-center rounded-lg cursor-pointer select-none"
              onClick={authenticate}
            >
              Login
            </div>
          </div>
        </LayoutCard>
      </form>
    </div>
  );
}

export default Login;
