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
  role: {
    read(): string | null
    write(e: string): void
  };
  permission: {
    read(): string[] | null
    write(e: string[]): void
    check(e: string): boolean
  };
  admin: {
    isAdmin(): boolean | null
    write(e: boolean): void
  }
}

export const useLocalStorage = (): LocalManageValue => {
  const ENDPOINT_KEY = 'ep';
  const ACCESS_TOKEN = 'at';
  const REFRESH_TOKEN = 'rt';
  const ROLE = 'ro';
  const PERMISSION = 'pe';
  const ADMIN = 'ad';

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

  const readRole = () => {
    return localStorage.getItem(ROLE);
  };

  const writeRole = (role: string) => {
    localStorage.setItem(ROLE, role);
  };

  const getAllPermission = () => {
    const permission = localStorage.getItem(PERMISSION);
    return (permission === null ? '' : permission).split('|');
  };

  const writePermission = (permissions: string[]) => {
    localStorage.setItem(PERMISSION, permissions.join('|'));
  };

  const checkPermission = (permission: string) => {
    return getAllPermission().includes(permission);
  };

  const isAdmin = () => {
    return localStorage.getItem(ADMIN) === 'true';
  }

  const setAdmin = (isAdmin: boolean) => {
    localStorage.setItem(ADMIN, isAdmin ? 'true' : 'false');
  }

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
    },
    role: {
      read: readRole,
      write: writeRole
    },
    permission: {
      read: getAllPermission,
      write: writePermission,
      check: checkPermission
    },
    admin: {
      isAdmin: isAdmin,
      write: setAdmin
    }
  };
};