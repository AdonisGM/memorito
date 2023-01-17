import {Body, Controller, Post, UseGuards, Request} from '@nestjs/common';
import {AuthService} from './auth.service';
import {PasswordSignupDto, RenewTokenDto, PasswordSigninDto, ChangePasswordDto} from './dto';
import {JwtAuthGuard} from './jwt-auth.guard';
import {IJwtPayload} from './auth.interface';

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
		return this.authService.signin(dto);
	}

	@Post('renew-token')
	renewToken(@Body() dto: RenewTokenDto) {
		return this.authService.renewToken(dto);
	}

	@Post('create-password')
	createPassword() {
	}

	@UseGuards(JwtAuthGuard)
	@Post('change-password')
	changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
		return this.authService.changePassword(req.user, dto)
	}

	@Post('active')
	active() {
	}
}
