export function isUserLoggedIn(getUser: () => any) {
  const user = getUser();
  if (user && user.token) {
    return true;
  }
  return false;
}
