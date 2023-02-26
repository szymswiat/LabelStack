import React, { useEffect, useState } from 'react';

import { User, userRoleRepresentation } from '@labelstack/api';

import Divider from '../../../../components/Divider';
import { useUserDataContext } from '../../../../contexts/UserDataContext';

interface ManageUserFormParams {
  createUser: boolean;
  userToEdit?: User;
}

const ManageUserForm = ({ createUser, userToEdit }: ManageUserFormParams) => {
  const [{ token }] = useUserDataContext();
  const [userFullName, setUserFullName] = useState<string>('');
  const [userFullNameValid, setUserFullNameValid] = useState<boolean>(undefined);
  const [userRolesIds, setUserRolesIds] = useState<Set<number>>(new Set());
  const [userRolesValid, setRolesValid] = useState<boolean>(undefined);
  const [user, setUser] = useState<User>({
    full_name: '',
    email: '',
    roles: [],
    is_active: false
  } as User);

  const sendForm = () => {};

  const deactivateUser = () => {};

  const handleUserFullNameChange = (e) => {
    if (e && e.target && e.target.value) {
      setUserFullName(e.target.value);
      setUserFullNameValid(true);
    } else {
      setUserFullName('');
      setUserFullNameValid(false);
    }
  };

  const handleUserRolesChange = (e) => {
    if (e && e.target && e.target.value) {
      let selectedRoles = userRolesIds;
      if (e.target.checked) {
        selectedRoles.add(e.target.value);
      } else {
        selectedRoles.delete(e.target.value);
      }
      console.log(selectedRoles);
      setUserRolesIds(selectedRoles);
    }
  };

  useEffect(() => {
    if (!createUser) {
      console.log(userToEdit);
      setUser(userToEdit);
    }
  }, [userToEdit]);

  return (
    <div className="w-8/12">
      <p className="w-full p-4 text-center text-xl font-bold dark:text-primary-light">
        {createUser ? 'Create User' : 'Edit User'}
      </p>
      <Divider />
      <form className="w-full" onSubmit={sendForm}>
        <div className="w-full mb-2 flex flex-col items-center">
          <label
            htmlFor="user-full-name"
            className="w-10/12 p-2 block mb-1 text-sm font-medium dark:text-primary-light"
          >
            Full Name
          </label>
          <input
            type="text"
            id="user-full-name"
            value={userFullName}
            onChange={(e) => handleUserFullNameChange(e)}
            className="w-10/12 block rounded-lg p-2 text-sm border dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
          />
          {userFullNameValid === false && (
            <p className="w-10/12 text-xs dark:text-red-500">user full name is required!</p>
          )}
        </div>
        <div className="w-full mb-2 flex flex-col items-center">
          <label htmlFor="user-email" className="w-10/12 p-2 block mb-1 text-sm font-medium dark:text-primary-light">
            Email
          </label>
          <input
            type="text"
            id="user-email"
            value={user.email}
            disabled={true}
            className="w-10/12 block rounded-lg p-2 text-sm border dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
          />
        </div>
        <div className="w-full mb-2 flex flex-col">
          <label htmlFor="user-roles" className="w-10/12 p-2 block mb-1 text-sm font-medium dark:text-primary-light">
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
            <p className="w-10/12 text-xs dark:text-red-500">user has to have at least one role!</p>
          )}
        </div>
        <div className="w-full mb-2 flex items-center">
          <label htmlFor="user-is-active" className="w-2/12 p-2 block mb-1 text-sm font-medium dark:text-primary-light">
            Is Active?
          </label>
          <input
            type="checkbox"
            id="user-email"
            checked={user.is_active}
            readOnly
            className="block rounded-lg p-2 h-6 w-6 border dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
          />
        </div>
        <div className="w-full flex place-content-center">
          <button
            type="submit"
            className="w-64 mx-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
          {createUser == false && (
            <button
              onClick={deactivateUser}
              className="w-64 mx-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Deactivate User
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ManageUserForm;
