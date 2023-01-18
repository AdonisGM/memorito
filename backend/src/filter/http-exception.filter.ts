import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
} from '@nestjs/common';
import {Request, Response} from 'express';
import {
	IErrorCodeCustom,
	IObjectExceptionResponse,
} from '../auth/auth.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly errorCodeCustom: IErrorCodeCustom;

	constructor() {
		this.errorCodeCustom = {
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
		};
	}

	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();
		const {error, message} = exception.getResponse() as IObjectExceptionResponse;

		let selectMessage: string;
		if (typeof message === 'string') {
			selectMessage = message;
		} else if (Array.isArray(message)) {
			selectMessage = message[0];
		} else {
			selectMessage = '';
		}

		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			message: {
				code: selectMessage,
				value: this.errorCodeCustom[selectMessage],
			},
			error: error,
			path: request.url,
		});
	}
}
