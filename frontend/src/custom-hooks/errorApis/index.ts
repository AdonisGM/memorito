const useErrorApis = () => {
  const errorApis = {
    error_auth_00000: 'An unknown error',
    error_auth_00001: 'Exist email in database',
    error_auth_00002: 'Password invalid',
    error_auth_00003: 'Email invalid',
    error_auth_00004: 'Name invalid',
    error_auth_00005: 'Email or password are not correct',
    error_auth_00006: 'User not active',
    error_auth_00007: 'Refresh token invalid',
    error_auth_00008: 'Generate new token fail',
    error_auth_00009: 'User not setup password',
    error_auth_00010: 'Old password should not be empty',
    error_auth_00011: 'New password should not be empty',
    error_auth_00012: 'New password must different old password',
    error_auth_00013: 'Change password fail',
    error_auth_00014: 'User not setup password',
    error_auth_00015: 'Old password not correct',
    error_auth_00016: 'Create password fail',
    error_auth_00017: 'Active account fail',
    error_auth_00018: 'User not exist',
    error_auth_00019: 'User already active',
    error_auth_00020: 'Request reset password fail',
    error_auth_00021: 'Accuracy request fail',
    error_auth_00022: 'Reset password fail',
  } as { [code: string]: string };

  const searchError = (name: string): string => {
    return errorApis[name] || 'An unknown error'
  }

  return {
    get: searchError
  }
}

export default useErrorApis