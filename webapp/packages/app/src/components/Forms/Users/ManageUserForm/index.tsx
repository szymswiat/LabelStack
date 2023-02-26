import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { User, userRoleRepresentation, UserCreate, api, UserUpdate } from '@labelstack/api';

import Divider from '../../../../components/Divider';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import { showSuccessNotification } from '../../../../utils';

export enum ManageUserFormMode {
  CREATE,
  UPDATE
}
interface ManageUserFormParams {
  mode: ManageUserFormMode;
  userToUpdate?: User;
}

const ManageUserForm = ({ mode, userToUpdate }: ManageUserFormParams) => {
  const navigate = useNavigate();
  const [{ token }] = useUserDataContext();

  const [passwordUpdate, setPasswordUpdate] = useState<boolean>(false);
  const [userPasswordValid, setUserPasswordValid] = useState<boolean>(undefined);
  const [userEmailValid, setUserEmailValid] = useState<boolean>(undefined);
  const [user, setUser] = useState<UserCreate>({
    email: '',
    full_name: '',
    role_ids: [],
    is_active: false
  } as UserCreate);

  const emailRegex = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  );

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(user);

    if (mode == ManageUserFormMode.CREATE) {
      createUser();
    } else if (mode == ManageUserFormMode.UPDATE) {
      updateUser();
    }
  };

  const createUser = () => {
    console.log(user);
    let newUser = Object.assign({}, user);
    api.createUser(token, newUser).then((response) => {
      navigate('/users/all');
      showSuccessNotification(undefined, 'User created successfully!');
    });
  };

  const updateUser = () => {
    console.log(user);
    let modifiedUser = Object.assign({}, user);
    if (!passwordUpdate) delete modifiedUser.password;
  };

  const activateUser = () => {};

  const deactivateUser = () => {};

  const handleUserFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let modifiedUser = Object.assign({}, user);
    const fullName = e.target.value;
    modifiedUser.full_name = fullName;
    setUser(modifiedUser);
  };

  const handleUserEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let modifiedUser = Object.assign({}, user);
    const email = e.target.value;
    modifiedUser.email = email;
    setUser(modifiedUser);
    emailRegex.test(email) ? setUserEmailValid(true) : setUserEmailValid(false);
  };

  const handleUserPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let modifiedUser = Object.assign({}, user);
    const password = e.target.value;
    modifiedUser.password = password;
    if (password != '') setUserPasswordValid(true);
    else setUserPasswordValid(false);
    setUser(modifiedUser);
  };

  const handleUserRolesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let modifiedUser = Object.assign({}, user);
    let selectedRoles = new Set(user.role_ids);
    if (e.target.checked) {
      selectedRoles.add(Number(e.target.value));
    } else {
      selectedRoles.delete(Number(e.target.value));
    }
    modifiedUser.role_ids = Array.from(selectedRoles);
    setUser(modifiedUser);
  };

  useEffect(() => {
    if (mode == ManageUserFormMode.UPDATE) {
      const roles = []; //userToUpdate.roles.map((role) => role.id);
      const tempUser: UserUpdate = {
        email: userToUpdate.email,
        password: '',
        full_name: userToUpdate.full_name ? userToUpdate.full_name : '',
        is_active: userToUpdate.is_active,
        role_ids: roles ? roles : []
      };
      setUser(tempUser as UserCreate);
    }
  }, [userToUpdate]);

  return (
    <div className="w-full flex flex-col items-center">
      <p className="w-full p-4 text-center text-xl font-bold dark:text-primary-light">
        {mode == ManageUserFormMode.CREATE ? 'Create User' : 'Edit User'}
      </p>
      <Divider />
      <form className="w-8/12 items-center" onSubmit={submitForm}>
        <div className="w-full mb-2 flex flex-col items-center">
          <label htmlFor="user-full-name" className="w-full p-2 block mb-1 text-sm font-medium dark:text-primary-light">
            Full Name
          </label>
          <input
            type="text"
            id="user-full-name"
            value={user.full_name}
            onChange={(e) => handleUserFullNameChange(e)}
            className="w-full block rounded-lg p-2 text-sm border dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
          />
        </div>
        <div className="w-full mb-2 flex flex-col items-center">
          <label htmlFor="user-email" className="w-full p-2 block mb-1 text-sm font-medium dark:text-primary-light">
            Email
          </label>
          <input
            type="text"
            id="user-email"
            value={user.email}
            onChange={(e) => handleUserEmailChange(e)}
            className="w-full block rounded-lg p-2 text-sm border dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
          />
          {userEmailValid === false && <p className="text-xs text-red-500">valid email is required!</p>}
        </div>
        <div className="w-full mb-2 flex flex-col items-center">
          <label
            htmlFor="user-password-update"
            className="w-full mt-2 text-sm font-medium dark:text-primary-light relative inline-flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              id="user-password-update"
              className="sr-only peer"
              value={'false'}
              onChange={(e) => setPasswordUpdate(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Password Update?</span>
          </label>
          <div className="w-full flex flex-col items-center">
            <label
              htmlFor="user-password"
              className="w-full p-2 block mb-1 text-sm font-medium dark:text-primary-light"
            >
              Password
            </label>
            <input
              type="password"
              id="user-password"
              value={user.password}
              disabled={!passwordUpdate}
              onChange={(e) => handleUserPasswordChange(e)}
              className="w-full block rounded-lg p-2 text-sm border disabled:dark:border-gray-200 disabled:dark:bg-gray-700 dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
            />
            {passwordUpdate === true && userPasswordValid == false && (
              <p className="text-xs text-red-500">password cannot be empty!</p>
            )}
          </div>
        </div>
        <div className="w-full mb-2 flex flex-col">
          <label htmlFor="user-roles" className="w-full p-2 block mb-1 text-sm font-medium dark:text-primary-light">
            Roles
          </label>
          {Object.entries(userRoleRepresentation).map(([key, value]) => (
            <label
              key={'label-user-role-' + key}
              htmlFor={'role-toggle-' + key}
              className="relative inline-flex items-center mb-4 cursor-pointer"
            >
              <input
                key={'input-user-role-' + key}
                type="checkbox"
                value={key}
                id={'role-toggle-' + key}
                className="sr-only peer"
                onChange={(e) => handleUserRolesChange(e)}
              />
              <div
                key={'div-user-role-' + key}
                className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
              <span key={'span-user-role-' + key} className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                {value}
              </span>
            </label>
          ))}
        </div>
        {mode == ManageUserFormMode.UPDATE && (
          <div className="w-full mb-2 flex flex-col">
            <label
              htmlFor="user-is-active"
              className="w-full p-2 block mb-1 text-sm font-medium dark:text-primary-light"
            >
              Is Active?
            </label>
            <input
              type="checkbox"
              id="user-is-active"
              checked={user.is_active}
              readOnly
              className="block rounded-lg p-2 h-8 w-8 border dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
            />
          </div>
        )}
        <div className="w-full flex place-content-center">
          <button
            type="submit"
            className="w-64 mx-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
          {mode == ManageUserFormMode.UPDATE && user.is_active == true && (
            <button
              onClick={deactivateUser}
              className="w-64 mx-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Deactivate User
            </button>
          )}
          {mode == ManageUserFormMode.UPDATE && user.is_active == false && (
            <button
              onClick={activateUser}
              className="w-64 mx-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Activate User
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ManageUserForm;
