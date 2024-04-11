import { getTimeZone } from './dateHelpers';
import { getLocaleCode } from './stringHelpers';
import { AuthService } from '~app/services/api';

type AppRequestInit = RequestInit & {
  authorization?: boolean;
};

export type ApiResult<T> = {
  data: T;
};

export async function fetchDataZalo<TResult>(input: RequestInfo, init?: AppRequestInit | undefined) {
  return await fetchAll<ApiResult<TResult>>(input, init, true);
}

export async function fetchAll<TResult>(
  input: RequestInfo,
  init?: AppRequestInit | undefined,
  disableTimeZone?: boolean,
) {
  const headers: HeadersInit = {};

  if (init?.authorization) {
    const token = await AuthService.getAccessToken();
    if (!token) {
      throw new Error('unauthorized');
    }
    headers.authorization = `Bearer ${token}`;
  }

  const rs = await fetch(input, {
    ...init,
    headers: {
      ...headers,
      ...init?.headers,
      'x-locale-code': getLocaleCode(),
      ...(!disableTimeZone ? { 'x-location-timezone': `UTC${getTimeZone()}` } : {}),
    },
  });

  if (rs.status >= 400) {
    const json = await rs.json();
    throw new Error(json?.message || json.error.detail || 'err_system');
  }

  const json = rs
    .json()
    .then((data) => {
      return data as TResult;
    })
    .catch(() => {
      return {} as TResult;
    });

  return json;
}

export async function fetchData<TResult>(input: RequestInfo, init?: AppRequestInit | undefined) {
  return (await fetchAll<ApiResult<TResult>>(input, init)).data;
}

export async function fetchStreamData(input: RequestInfo, init?: AppRequestInit | undefined) {
  return await fetchAllData(input, init);
}

export function post<T, Body = ExpectedAny>(input: RequestInfo, body: Body, init?: AppRequestInit | undefined) {
  return fetchData<T>(input, {
    ...init,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export function postAsFetchAll<T, Body = ExpectedAny>(
  input: RequestInfo,
  body: Body,
  init?: AppRequestInit | undefined,
) {
  return fetchAll<T>(input, {
    ...init,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export function put<T, Body = ExpectedAny>(input: RequestInfo, body: Body, init?: AppRequestInit | undefined) {
  return fetchData<T>(input, {
    ...init,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export function patch<T, Body = ExpectedAny>(input: RequestInfo, body: Body, init?: AppRequestInit | undefined) {
  return fetchData<T>(input, {
    ...init,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export function deleteMethod<T, Body = ExpectedAny>(input: RequestInfo, body: Body, init?: AppRequestInit | undefined) {
  return fetchData<T>(input, {
    ...init,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

async function fetchAllData(input: RequestInfo, init?: AppRequestInit | undefined) {
  const headers: HeadersInit = {};

  if (init?.authorization) {
    const token = await AuthService.getAccessToken();
    if (!token) {
      throw new Error('UNAUTHORIZE');
    }
    headers.authorization = `Bearer ${token}`;
  }

  const rs = await fetch(input, {
    ...init,
    headers: {
      ...headers,
      ...init?.headers,
      'x-location-timezone': `UTC${getTimeZone()}`,
      'x-locale-code': getLocaleCode(),
    },
  });

  if (rs.status >= 400) {
    const json = await rs.json();
    throw new Error(json?.message || json.error.detail || 'ERR_SYSTEM');
  }

  return rs;
}
