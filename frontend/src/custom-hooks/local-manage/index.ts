interface LocalManageValue {
  endpoint: {
    read(): string | null,
    write(e: string): void
  }
}

export const useLocalStorage = (): LocalManageValue => {
  const ENDPOINT_KEY = 'ep'
  const ACCESS_TOKEN = 'at'
  const REFRESH_TOKEN = 'rt'

  const readEndpoint = () => {
    return localStorage.getItem(ENDPOINT_KEY);
  };

  const writeEndpoint = (endpoint: string): void => {
    localStorage.setItem(ENDPOINT_KEY, endpoint);
  };

  return {
    endpoint: {
      read: readEndpoint,
      write: writeEndpoint
    }
  };
};