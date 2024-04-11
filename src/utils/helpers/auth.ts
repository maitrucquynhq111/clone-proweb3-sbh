import jwtDecode from 'jwt-decode';
import {
  REFRESH_TOKEN_KEY,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_BEFORE,
  RENEW_WINDOW_TIME,
  AUTH_URI,
  LOCALE_KEY,
} from '~app/configs';
import { Language } from '~app/i18n/enums';

export const shouldRefresh = (token: string) =>
  jwtDecode<ExpectedAny>(token).exp * 1000 - new Date().valueOf() <= REFRESH_TOKEN_BEFORE;

export const shouldLogout = (expire_time: string) => {
  if (Date.parse(expire_time) < Date.parse(new Date().toString())) {
    return true;
  }
  return false;
};

export function shouldRefreshToken(accessToken: string) {
  try {
    const decodedToken = jwtDecode<{ exp: number }>(accessToken);

    if (decodedToken.exp * 1000 - new Date().valueOf() < RENEW_WINDOW_TIME) {
      return true;
    }

    return false;
  } catch (ex) {
    return true;
  }
}

export async function getAccessToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    return false;
  }

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!accessToken) {
    return false;
  }

  return accessToken;
}

export const handleLogin = () => {
  const authUri = AUTH_URI || '/login';
  const origin = location.origin;
  const target = `${origin}/`;

  const callback = `${origin}?callback=${encodeURIComponent(target)}&step=success`;

  window.location.href = `${authUri}?callback=${encodeURIComponent(callback)}&lng=${
    window.localStorage.getItem(LOCALE_KEY) || Language.VI
  }`;
};

export const handleLogout = () => {
  const authUri = AUTH_URI || '/login';
  const origin = location.origin;
  window.location.href = `${authUri}/logout?callback=${encodeURIComponent(origin)}&lng=${
    window.localStorage.getItem(LOCALE_KEY) || Language.VI
  }`;
};
