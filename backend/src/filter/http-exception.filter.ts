import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import {Request, Response} from 'express';

interface IErrorCodeCustom {
  [code: string]: string
}

interface IObjectExceptionResponse {
  message: string | string[],
  error: string,
  statusCode: number
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly errorCodeCustom: IErrorCodeCustom

  constructor() {
    this.errorCodeCustom = {
      'error-auth-00000': 'An unknown error',
      'error-auth-00001': 'Exist email in database',
      'error-auth-00002': 'Password invalid',
      'error-auth-00003': 'Email invalid',
      'error-auth-00004': 'Name invalid'
    }
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const data = exception.getResponse() as IObjectExceptionResponse;

    let selectMessage: string
    if (typeof data.message === 'string') {
      selectMessage = data.message
    } else if (Array.isArray(data.message)) {
      selectMessage = data.message[0]
    } else {
      selectMessage = ''
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: {
        code: selectMessage,
        value: this.errorCodeCustom[selectMessage]
      },
      error: data.error,
      path: request.url,
    });
  }
}
