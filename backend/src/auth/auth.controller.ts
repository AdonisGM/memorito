import {Body, Controller, Post, UseGuards, Request, HttpCode} from '@nestjs/common';
import {AuthService} from './auth.service';
import {PasswordSignupDto, RenewTokenDto, PasswordSigninDto, ChangePasswordDto, CreatePasswordDto} from './dto';
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
		return this.authService.createPassword(req.user, dto)
	}

	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@Post('change-password')
	async changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
		await this.authService.checkActive(req.user);
		return this.authService.changePassword(req.user, dto)
	}

	@Post('active')
	active() {
	}
}
