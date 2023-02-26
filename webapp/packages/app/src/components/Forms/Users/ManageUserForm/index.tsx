import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { User, userRoleRepresentation, UserCreate, api } from '@labelstack/api';

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

  const [userEmailValid, setUserEmailValid] = useState<boolean>(undefined);
  const [userRolesIds, setUserRolesIds] = useState<Set<number>>(new Set());
  const [userRolesValid, setRolesValid] = useState<boolean>(undefined);
  const [user, setUser] = useState<UserCreate>({
    full_name: '',
    email: '',
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
      api.createUser(token, user).then((response) => {
        navigate('/users/all');
        showSuccessNotification(undefined, 'User created successfully!');
      });
    } else {
      //     api.updateUser(token, user.id, user).then((response) => {
      //  })
    }
  };

  const createUser = () => {};

  const editUser = () => {};

  const activateUser = () => {};

  const deactivateUser = () => {};

  const handleUserFullNameChange = (e) => {
    let modifiedUser = Object.assign({}, user);
    modifiedUser.full_name = e.target.value;
    setUser(modifiedUser);
  };

  const handleUserEmailChange = (e) => {
    let modifiedUser = Object.assign({}, user);
    if (e && e.target && e.target.value) {
      const email = e.target.value;
      modifiedUser.email = email;
      setUser(modifiedUser);
      if (emailRegex.test(email)) {
        setUserEmailValid(true);
      } else {
        setUserEmailValid(false);
      }
    } else {
      modifiedUser.email = '';
      setUser(modifiedUser);
      setUserEmailValid(false);
    }
  };

  const handleUserRolesChange = (e) => {
    let modifiedUser = Object.assign({}, user);
    let selectedRoles = userRolesIds;
    if (e && e.target && e.target.value) {
      if (e.target.checked) {
        selectedRoles.add(e.target.value);
      } else {
        selectedRoles.delete(e.target.value);
      }
    }
    setUserRolesIds(selectedRoles);
    modifiedUser.role_ids = Array.from(selectedRoles);
    setUser(modifiedUser);
    console.log(modifiedUser);
  };

  useEffect(() => {
    if (mode == ManageUserFormMode.UPDATE) {
      setUser(Object.assign({}, userToUpdate));
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
          {userRolesValid === false && (
            <p className="w-full w-10/12 text-xs dark:text-red-500">user has to have at least one role!</p>
          )}
        </div>
        <div className="w-full mb-2 flex flex-col">
          <label htmlFor="user-is-active" className="w-full p-2 block mb-1 text-sm font-medium dark:text-primary-light">
            Is Active?
          </label>
          <input
            type="checkbox"
            id="user-email"
            checked={user.is_active}
            readOnly
            className="block rounded-lg p-2 h-8 w-8 border dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
          />
        </div>
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
