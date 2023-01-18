export interface IJwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

export interface IErrorCodeCustom {
  [code: string]: string;
}

export interface IObjectExceptionResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}
