import { useAuth0 } from '@auth0/auth0-react';

const authService = () => {
  const { loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();

  const login = async () => {
    await loginWithRedirect();
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const getToken = async () => {
    const token = await getAccessTokenSilently();
    return token;
  };

  return {
    login,
    logout: handleLogout,
    getToken
  };
};

export default authService;