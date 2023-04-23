import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  PasswordSignupDto,
  RenewTokenDto,
  PasswordSigninDto,
  ChangePasswordDto,
  CreatePasswordDto,
  ActiveAccountDto,
  ResetPasswordRequestDto,
  AccuracyPasswordRequestDto,
  ResetPasswordDto,
} from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('signup-password')
  signup(@Body() dto: PasswordSignupDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(200)
  @Post('signin-password')
  signin(@Body() dto: PasswordSigninDto) {
    return this.authService.signin(dto);
  }

  @Post('renew-token')
  renewToken(@Body() dto: RenewTokenDto) {
    return this.authService.renewToken(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-password')
  async createPassword(@Request() req: any, @Body() dto: CreatePasswordDto) {
    await this.authService.checkActive(req.user);
    return this.authService.createPassword(req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('change-password')
  async changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    await this.authService.checkActive(req.user);
    return this.authService.changePassword(req.user, dto);
  }

  @HttpCode(200)
  @Post('active')
  active(@Body() dto: ActiveAccountDto) {
    return this.authService.activeAccount(dto);
  }

  @HttpCode(200)
  @Post('reset-password/request')
  requestResetPassword(@Body() dto: ResetPasswordRequestDto) {
    return this.authService.requestResetPassword(dto);
  }

  @HttpCode(200)
  @Post('reset-password/accuracy')
  accuracyCodeResetPassword(@Body() dto: AccuracyPasswordRequestDto) {
    return this.authService.accuracyCodeResetPassword(dto);
  }

  @HttpCode(200)
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
