interface ApisTypes {
  name: string
  url: string
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'
  contextType: 'application/json' | 'multipart/form-data'
}

const useApis = () => {
  const apis: ApisTypes[] = [
    {name: 'sign_in_password', url: '/api/auth/signin-password', method: 'POST', contextType: 'application/json'}
  ];

  const getByName = (name: string): ApisTypes | undefined => {
    return apis.find((api) => {
      return api.name == name
    })
  }

  return {
    get: getByName
  };
};

export default useApis;