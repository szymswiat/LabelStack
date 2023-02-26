import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import {
  api,
  User,
  UserCreate,
  UserUpdate,
  Role,
  RoleType,
  userRoleRepresentation
} from '@labelstack/api';

import Divider from '../../../../components/Divider';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import { showSuccessNotification } from '../../../../utils';
import { showDangerNotification, showNotificationWithApiError } from '../../../../utils/notifications';
import { ifUserHasRole } from '../../../../utils/user';
import { BsFillCheckSquareFill, BsFillXSquareFill } from 'react-icons/bs';

export enum ManageUserFormMode {
  CREATE,
  UPDATE
}
interface ManageUserFormParams {
  mode: ManageUserFormMode;
  roles: Role[];
  userToUpdate?: User;
}

const ManageUserForm = ({ mode, roles, userToUpdate }: ManageUserFormParams) => {
  const navigate = useNavigate();
  const [{ user, token }] = useUserDataContext();

  const [isLoggedInUserSuperAdmin, setIsLoggedInUserSuperAdmin] = useState<boolean>(false);
  const [passwordUpdate, setPasswordUpdate] = useState<boolean>(false);
  const [passwordValid, setPasswordValid] = useState<boolean>(undefined);
  const [emailValid, setEmailValid] = useState<boolean>(undefined);
  const [formUser, setFormUser] = useState<UserCreate>({
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

    if (mode == ManageUserFormMode.CREATE) {
      createUser();
    } else if (mode == ManageUserFormMode.UPDATE) {
      updateUser();
    }
  };

  const createUser = () => {
    if (isFormValid()) {
      let newUser = Object.assign({}, formUser);
      api
        .createUser(token, newUser)
        .then(() => {
          navigate('/users/all');
          showSuccessNotification(undefined, 'User created successfully!');
        })
        .catch((error: any) => {
          showNotificationWithApiError(error);
        });
    }
  };

  const updateUser = () => {
    if (isFormValid()) {
      let modifiedUser: UserUpdate = {};

      if (passwordUpdate) modifiedUser.password = formUser.password;
      if (formUser.full_name != userToUpdate.full_name) modifiedUser.full_name = formUser.full_name;
      if (formUser.email != userToUpdate.email) modifiedUser.email = formUser.email;
      if (checkIfRolesChanged()) modifiedUser.role_ids = formUser.role_ids;

      api
        .updateUser(token, userToUpdate.id, modifiedUser)
        .then(() => {
          navigate('/users/all');
          showSuccessNotification(undefined, 'User updated successfully!');
        })
        .catch((error: any) => {
          showNotificationWithApiError(error);
        });
    }
  };

  const isFormValid = () => {
    if (emailRegex.test(formUser.email) == false) {
      setEmailValid(false);
      showDangerNotification(undefined, 'Valid email is required!');
      return false;
    } else if (passwordUpdate == true && (formUser.password == null || formUser.password == '')) {
      setPasswordValid(false);
      showDangerNotification(undefined, 'Password cannot be empty!');
      return false;
    }
    return true;
  };

  const checkIfRolesChanged = () => {
    const userRoles = userToUpdate.roles.map((role) => role.id);
    const newRoles = formUser.role_ids;

    if (userRoles.length != newRoles.length) return true;
    for (let i = 0; i < userRoles.length; i++) {
      if (!userRoles.includes(newRoles[i])) return true;
    }
    return false;
  };

  const activateUser = () => {
    api
      .updateUser(token, userToUpdate.id, { is_active: true } as UserUpdate)
      .then(() => {
        location.reload();
      })
      .catch((error: any) => {
        showNotificationWithApiError(error);
      });
  };

  const deactivateUser = () => {
    api
      .updateUser(token, userToUpdate.id, { is_active: false } as any)
      .then(() => {
        location.reload();
      })
      .catch((error: any) => {
        showNotificationWithApiError(error);
      });
  };

  const handleUserEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let modifiedUser = Object.assign({}, formUser);
    const email = e.target.value;
    modifiedUser.email = email;
    setFormUser(modifiedUser);
    emailRegex.test(email) ? setEmailValid(true) : setEmailValid(false);
  };

  const handleUserPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let modifiedUser = Object.assign({}, formUser);
    const password = e.target.value;
    modifiedUser.password = password;
    password != '' ? setPasswordValid(true) : setPasswordValid(false);
    setFormUser(modifiedUser);
  };

  const handleUserRolesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let modifiedUser = Object.assign({}, formUser);
    let selectedRoles = new Set(formUser.role_ids);
    if (e.target.checked) {
      selectedRoles.add(Number(e.target.value));
    } else {
      selectedRoles.delete(Number(e.target.value));
    }
    modifiedUser.role_ids = Array.from(selectedRoles);
    setFormUser(modifiedUser);
  };

  useEffect(() => {
    if (userToUpdate != null && mode == ManageUserFormMode.UPDATE) {
      const userRoles = userToUpdate.roles.map((role) => role.id);
      const tempUser: UserUpdate = {
        email: userToUpdate.email,
        password: '',
        full_name: userToUpdate.full_name ? userToUpdate.full_name : '',
        is_active: userToUpdate.is_active,
        role_ids: userRoles ? userRoles : []
      };
      setFormUser(tempUser as UserCreate);
    }
  }, [userToUpdate]);

  useEffect(() => {
    setIsLoggedInUserSuperAdmin(ifUserHasRole(user, RoleType.superuser));
  }, []);

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
            value={formUser.full_name}
            onChange={(e) => setFormUser({ ...formUser, full_name: e.target.value })}
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
            value={formUser.email}
            onChange={(e) => handleUserEmailChange(e)}
            className="w-full block rounded-lg p-2 text-sm border dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
          />
          {emailValid === false && <p className="text-xs text-red-500">valid email is required!</p>}
        </div>
        <div className="w-full mb-2 flex flex-col items-center">
          {mode == ManageUserFormMode.UPDATE && (
            <label
              htmlFor="user-password-update"
              className="w-full mt-2 text-sm font-medium dark:text-primary-light relative inline-flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                id="user-password-update"
                className="sr-only peer"
                onChange={(e) => setPasswordUpdate(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Password Update?</span>
            </label>
          )}
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
              value={formUser.password}
              disabled={mode == ManageUserFormMode.UPDATE && !passwordUpdate}
              onChange={(e) => handleUserPasswordChange(e)}
              className="w-full block rounded-lg p-2 text-sm border disabled:dark:border-gray-200 disabled:dark:bg-gray-700 dark:border-primary-light dark:focus:ring-primary-light dark:focus:border-primary-light dark:bg-secondary-active dark:placeholder-primary-light dark:text-primary-light"
            />
            {passwordUpdate === true && passwordValid == false && (
              <p className="text-xs text-red-500">password cannot be empty!</p>
            )}
          </div>
        </div>
        {isLoggedInUserSuperAdmin && (
          <div className="w-full mb-2 flex flex-col">
            <label htmlFor="user-roles" className="w-full p-2 block mb-1 text-sm font-medium dark:text-primary-light">
              Roles
            </label>
            {roles.map((role) => (
              <label
                key={'label-user-role-' + role.id}
                htmlFor={'role-toggle-' + role.id}
                className="relative inline-flex items-center mb-4 cursor-pointer"
              >
                <input
                  key={'input-user-role-' + role.id}
                  type="checkbox"
                  value={role.id}
                  id={'role-toggle-' + role.id}
                  className="sr-only peer"
                  checked={formUser.role_ids.includes(role.id)}
                  onChange={(e) => handleUserRolesChange(e)}
                />
                <div
                  key={'div-user-role-' + role.id}
                  className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                ></div>
                <span
                  key={'span-user-role-' + role.id}
                  className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {userRoleRepresentation[role.type]}
                </span>
              </label>
            ))}
          </div>
        )}
        {mode == ManageUserFormMode.UPDATE && (
          <div className="w-full mb-2 flex">
            <label htmlFor="user-is-active" className="p-2 mb-1 mr-2 text-sm font-medium dark:text-primary-light">
              Is Active?
            </label>
            {formUser.is_active == true && <BsFillCheckSquareFill className="text-3xl mt-1 dark:text-green-700" />}
            {formUser.is_active == false && <BsFillXSquareFill className="text-3xl mt-1 dark:text-red-700" />}
          </div>
        )}
        <div className="w-full flex place-content-center">
          <button
            type="submit"
            className="w-64 mx-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
          {isLoggedInUserSuperAdmin == true && mode == ManageUserFormMode.UPDATE && formUser.is_active == true && (
            <button
              onClick={deactivateUser}
              className="w-64 mx-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Deactivate User
            </button>
          )}
          {isLoggedInUserSuperAdmin && mode == ManageUserFormMode.UPDATE && formUser.is_active == false && (
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
