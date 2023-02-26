import { User, RoleType } from '@labelstack/api';

export function isUserLoggedIn(getUser: () => any) {
  const user = getUser();
  if (user && user.token) {
    return true;
  }
  return false;
}

export function ifUserHasRole(user: User, role: RoleType) {
  for (let i = 0; i < user.roles.length; i++) {
    if (user.roles[i].type == role) return true;
  }

  return false;
}
