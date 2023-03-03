import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { api, User, UserCreate, UserUpdate, Role, RoleType, userRoleRepresentation } from '@labelstack/api';

import Divider from '../../../../components/Divider';
import { useUserDataContext } from '../../../../contexts/UserDataContext';
import { showSuccessNotification } from '../../../../utils';
import { showDangerNotification, showNotificationWithApiError } from '../../../../utils/notifications';
import { ifUserHasRole } from '../../../../utils/user';
import { useEffectNonNull } from '../../../../utils/hooks';
import Switch from '../../../Switch';

export enum ManageUserFormMode {
  CREATE,
  UPDATE
}

interface ManageUserFormParams {
  mode: ManageUserFormMode;
  roles: Role[];
  userToUpdate?: User;
}

const getNewUserObject = (existingUser?: User): UserCreate | UserUpdate => {
  let newUser: UserCreate | UserUpdate = {};

  const fullName = existingUser ? existingUser.full_name : '';
  const userRoles = existingUser ? existingUser.roles.map((role) => role.id) : [];

  newUser.email = existingUser ? existingUser.email : '';
  newUser.is_active = existingUser ? existingUser.is_active : true;
  newUser.full_name = fullName ? fullName : '';
  newUser.role_ids = userRoles ? userRoles : [];
  newUser.password = '';

  return newUser;
};

const ManageUserForm = ({ mode, roles, userToUpdate }: ManageUserFormParams) => {
  const navigate = useNavigate();
  const [{ user, token }, { reloadUserData }] = useUserDataContext();

  const [isLoggedInUserSuperAdmin, setIsLoggedInUserSuperAdmin] = useState<boolean>(false);
  const [passwordUpdate, setPasswordUpdate] = useState<boolean>(false);
  const [passwordValid, setPasswordValid] = useState<boolean>(undefined);
  const [emailValid, setEmailValid] = useState<boolean>(undefined);
  const [formUser, setFormUser] = useState<UserCreate | UserUpdate>(getNewUserObject);

  const emailRegex = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  );

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (mode == ManageUserFormMode.CREATE) {
      createUser();
    } else if (mode == ManageUserFormMode.UPDATE) {
      updateUser();
    }
  }

  async function createUser() {
    if (isFormValid()) {
      let newUser = { ...formUser };
      try {
        await api.createUser(token, newUser as UserCreate);
        navigate('/users/all');
        showSuccessNotification(undefined, 'User created successfully!');
      } catch (error) {
        showNotificationWithApiError(error);
      }
    }
  }


  async function updateUser() {
    if (isFormValid()) {
      let modifiedUser: UserUpdate = {};

      if (passwordUpdate) modifiedUser.password = formUser.password;
      if (formUser.full_name != userToUpdate.full_name) modifiedUser.full_name = formUser.full_name;
      if (formUser.email != userToUpdate.email) modifiedUser.email = formUser.email;
      if (checkIfRolesChanged()) modifiedUser.role_ids = formUser.role_ids;
      if (formUser.is_active != userToUpdate.is_active) modifiedUser.is_active = formUser.is_active;

      try {
        await api.updateUser(token, userToUpdate.id, modifiedUser);
        if (isLoggedInUserSuperAdmin) {
          navigate('/users/all');
        }
        reloadUserData();
        showSuccessNotification(undefined, 'User updated successfully!');
      } catch (error) {
        showNotificationWithApiError(error);
      }
    }
  }

  function isFormValid() {
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
  }

  function checkIfRolesChanged() {
    const userRoles = userToUpdate.roles.map((role) => role.id);
    const newRoles = formUser.role_ids;

    if (userRoles.length != newRoles.length) return true;
    for (let i = 0; i < userRoles.length; i++) {
      if (!userRoles.includes(newRoles[i])) return true;
    }
    return false;
  }

  function handleUserEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    let modifiedUser = { ...formUser };
    const email = e.target.value;
    modifiedUser.email = email;
    setFormUser(modifiedUser);
    emailRegex.test(email) ? setEmailValid(true) : setEmailValid(false);
  }

  function handleUserPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    let modifiedUser = { ...formUser };
    const password = e.target.value;
    modifiedUser.password = password;
    password != '' ? setPasswordValid(true) : setPasswordValid(false);
    setFormUser(modifiedUser);
  }

  function handleUserRolesChange(checked: boolean, role: Role) {
    let modifiedUser = { ...formUser };
    let selectedRoles = new Set(formUser.role_ids);
    if (checked) {
      selectedRoles.add(Number(role.id));
    } else {
      selectedRoles.delete(Number(role.id));
    }
    modifiedUser.role_ids = Array.from(selectedRoles);
    setFormUser(modifiedUser);
  }

  function handleUserActiveChange(active: boolean) {
    let modifiedUser = { ...formUser };
    modifiedUser.is_active = active;
    setFormUser(modifiedUser);
  }

  useEffectNonNull(
    () => {
      if (mode == ManageUserFormMode.UPDATE) {
        const tempUser = getNewUserObject(userToUpdate);
        setFormUser(tempUser);
      }
    },
    [],
    [userToUpdate]
  );

  useEffect(() => {
    setIsLoggedInUserSuperAdmin(ifUserHasRole(user, RoleType.superuser));
  }, []);

  return (
    <div className="grid place-items-center">
      <div className="flex flex-col items-center w-[55rem] pt-20">
        <p className="w-full p-4 text-center text-xl font-bold">
          {mode == ManageUserFormMode.CREATE ? 'Create User' : 'Edit User'}
        </p>
        <Divider />
        <form className="w-8/12 items-center flex flex-col gap-y-6 mt-3" onSubmit={submitForm}>
          <div className="w-full flex flex-col gap-y-2 items-start">
            <label htmlFor="user-full-name" className="w-full ml-2 text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="user-full-name"
              value={formUser.full_name}
              onChange={(e) => setFormUser({ ...formUser, full_name: e.target.value })}
              className="w-full rounded-lg h-10 px-2 text-sm border bg-dark-bg"
            />
          </div>
          <div className="w-full flex flex-col gap-y-2 items-start">
            <label htmlFor="user-email" className="w-full ml-2 text-sm font-medium">
              Email
            </label>
            <input
              type="text"
              id="user-email"
              value={formUser.email}
              onChange={(e) => handleUserEmailChange(e)}
              className="w-full rounded-lg h-10 px-2 text-sm border bg-dark-bg"
            />
            {emailValid === false && <p className="text-xs text-red-500">Valid email is required!</p>}
          </div>
          <div className="w-full flex flex-col gap-y-2 items-start">
            <div className="flex flex-row w-full items-center">
              <label htmlFor="user-password" className="ml-2 text-sm font-medium">
                Password
              </label>
              {mode == ManageUserFormMode.UPDATE && (
                <Switch className="ml-2" onChange={(checked) => setPasswordUpdate(checked)} />
              )}
            </div>
            <input
              type="password"
              id="user-password"
              value={formUser.password}
              disabled={mode == ManageUserFormMode.UPDATE && !passwordUpdate}
              onChange={(e) => handleUserPasswordChange(e)}
              className="w-full rounded-lg h-10 text-sm border bg-dark-bg"
            />
            {passwordUpdate === true && passwordValid == false && (
              <p className="text-xs text-red-500 mt-2 font-bold">Password cannot be empty!</p>
            )}
          </div>
          {isLoggedInUserSuperAdmin && (
            <div className="w-full flex flex-col gap-y-2">
              <label htmlFor="user-roles" className="w-full ml-2 text-sm font-medium">
                Roles
              </label>
              {roles.map((role) => (
                <Switch
                  checked={formUser.role_ids.includes(Number(role.id))}
                  onChange={(checked) => handleUserRolesChange(checked, role)}
                  description={userRoleRepresentation[role.type]}
                />
              ))}
              <Switch
                className="mt-4"
                checked={formUser.is_active}
                onChange={handleUserActiveChange}
                description={'Is Active'}
              />
            </div>
          )}
          <div className="w-full flex place-content-center">
            <button type="submit" className="w-64 h-10 font-medium rounded-lg text-sm text-center bg-dark-bg">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageUserForm;
