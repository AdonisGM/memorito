interface LocalManageValue {
  endpoint: {
    read(): string | null,
    write(e: string): void
  }
}

export const LocalManage = (): LocalManageValue => {
  const ENDPOINT_KEY = 'endpoint'

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