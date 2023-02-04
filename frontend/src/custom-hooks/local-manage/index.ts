interface LocalManageValue {
  endpoint: {
    read(): string | null
    write(e: string): void
  };
  accessToken: {
    read(): string | null
    write(e: string): void
  };
  refreshToken: {
    read(): string | null
    write(e: string): void
  };
}

export const useLocalStorage = (): LocalManageValue => {
  const ENDPOINT_KEY = 'ep';
  const ACCESS_TOKEN = 'at';
  const REFRESH_TOKEN = 'rt';

  const readEndpoint = () => {
    return localStorage.getItem(ENDPOINT_KEY);
  };

  const writeEndpoint = (endpoint: string): void => {
    localStorage.setItem(ENDPOINT_KEY, endpoint);
  };

  const readAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN);
  };
  const writeAccessToken = (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN, token);
  };
  const readRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN);
  };
  const writeRefreshToken = (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN, token);
  };

  return {
    endpoint: {
      read: readEndpoint,
      write: writeEndpoint
    },
    accessToken: {
      read: readAccessToken,
      write: writeAccessToken
    },
    refreshToken: {
      read: readRefreshToken,
      write: writeRefreshToken
    }
  };
};