import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from './auth.service';
import {PasswordSignupDto} from './dto';
import {PasswordSigninDto} from "./dto/signin.dto";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('signup-password')
  signup(@Body() dto: PasswordSignupDto) {
    return this.authService.signup(dto);
  }

  @Post('signin-password')
  signin(@Body() dto: PasswordSigninDto) {
    return this.authService.signin();
  }
}
