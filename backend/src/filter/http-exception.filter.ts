import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  IErrorCodeCustom,
  IObjectExceptionResponse,
} from '../auth/auth.interface';
import moment from 'moment/moment';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly errorCodeCustom: IErrorCodeCustom;

  constructor() {
    this.errorCodeCustom = {
      error_auth_00000: 'Lỗi không xác định',
      error_auth_00001: 'Email đã tồn tại trong hệ thống',
      error_auth_00002: 'Mật khẩu không hợp lệ',
      error_auth_00003: 'Email không hợp lệ',
      error_auth_00004: 'Tên không hợp lệ',
      error_auth_00005: 'Đăng ký tài khoản thất bại',
      error_auth_00006: 'Tài khoản chưa được kích hoạt',
      error_auth_00007: 'Xác thực tài khoản thất bại',
      error_auth_00008: 'Tạo token thất bại',
      error_auth_00009: 'Tài khoản chưa tạo mật khẩu',
      error_auth_00010: 'Mật khẩu cũ không được để trống',
      error_auth_00011: 'Mật khẩu mới không được để trống',
      error_auth_00012: 'Mật khẩu không khớp',
      error_auth_00013: 'Thay đổi mật khẩu thất bại',
      error_auth_00014: 'Tài khoản chưa tạo mật khẩu',
      error_auth_00015: 'Mật khẩu cũ không đúng',
      error_auth_00016: 'Tạo mật khẩu thất bại',
      error_auth_00017: 'Kích hoạt tài khoản thất bại',
      error_auth_00018: 'Tài khoản không tồn tại',
      error_auth_00019: 'Tài khoản đã được kích hoạt',
      error_auth_00020: 'Yêu cầu reset mật khẩu thất bại',
      error_auth_00021: 'Xác thực reset mật khẩu thất bại',
      error_auth_00022: 'Reset mật khẩu thất bại',
      error_auth_00023: 'Tên quyền không hợp lệ',
      error_auth_00024: 'Mã của quyền không hợp lệ',
      error_auth_00025: 'Quyền không hợp lệ hoặc không tồn tại',
      error_auth_00026: 'Mã hoặc tên quyền đã tồn tại',
      error_auth_00027: 'Tên chức danh không hợp lệ',
      error_auth_00028: 'Giá trị chức danh không hợp lệ',
      error_auth_00029: 'Mô tả chức danh không hợp lệ',
      error_auth_00030: 'Giá trị hoặc tên chức danh đã tồn tại',
      error_auth_00031: 'Chức danh không hợp lệ hoặc không tồn tại',
    };
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const { error, message } =
      exception.getResponse() as IObjectExceptionResponse;

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
      timestamp: moment().utc().toISOString(),
      message: {
        code: selectMessage,
        value: this.errorCodeCustom[selectMessage],
      },
      error: error,
      path: request.url,
    });
  }
}
