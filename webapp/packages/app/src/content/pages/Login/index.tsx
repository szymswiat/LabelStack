import React from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

import { api, IUserProfile, requestErrorMessageKey } from '@labelstack/api';
import { useUserDataContext } from '../../../contexts/UserDataContext';
import { showDangerNotification, showSuccessNotification } from '../../../utils';
import { useDocumentTitle } from '../../../utils/hooks';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, { setUser, setToken }] = useUserDataContext();

  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  useDocumentTitle('LabelStack');

  const isFormValid = () => {
    if (!username || username === '' || !password || password === '') {
      showDangerNotification(undefined, "Username and password can't be empty!");
      return false;
    }
    return true;
  };

  const fetchUserData = (access_token: string) => {
    api
      .getMe(access_token)
      .then((meResponse) => {
        setUser(meResponse.data);
        navigate(location.state['from']);
      })
      .catch((error: AxiosError) => {
        setToken('');
        setUser({} as IUserProfile);
        showDangerNotification(undefined, error.response.data[requestErrorMessageKey]);
      });
  };

  const authenticate = () => {
    if (isFormValid()) {
      api
        .logInGetToken(username, password)
        .then((tokenResponse) => {
          const access_token = tokenResponse.data.access_token as string;
          setToken(access_token);

          fetchUserData(access_token);
          showSuccessNotification(undefined, 'Successfully logged in!');
        })
        .catch((error: AxiosError) => {
          showDangerNotification(undefined, error.response.data[requestErrorMessageKey]);
        });
    }
  };

  const handleEnterPress = (event: any) => {
    if (event.key === 'Enter') {
      authenticate();
    }
  };

  return (
    <>
      <div className="flex justify-center items-center flex-wrap h-full">
        <div className="block bg-white shadow-lg rounded-lg p-10">
          <div className="px-6 h-full text-gray-800">
            <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
              <form onKeyPress={handleEnterPress}>
                <div className="mb-6">
                  <input
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600"
                    id="username_input"
                    placeholder="username/email"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="password"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600"
                    id="password_input"
                    placeholder="password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>

                <div className="text-center lg:text-left">
                  <button
                    type="button"
                    onClick={authenticate}
                    className="w-full inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 active:bg-blue-800 active:shadow-lg"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
