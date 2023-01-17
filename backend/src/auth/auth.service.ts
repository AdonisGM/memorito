import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User, UserDocument} from '../schemas/user.schema';
import {v4 as uuidv4} from 'uuid';
import {nanoid} from 'nanoid';
import * as bcrypt from 'bcrypt';
import {PasswordSigninDto, RenewTokenDto, PasswordSignupDto, ChangePasswordDto} from './dto';
import {JwtService} from '@nestjs/jwt';
import * as process from 'process';
import {IJwtPayload} from './auth.interface';

@Injectable()
export class AuthService {
	private readonly SALT_ROUND = 15;
	private readonly ONE_HOUR = '1h';
	private readonly SEVEN_DAYS = '7d';

	constructor(
		@InjectModel(User.name) private mongodbUserService: Model<UserDocument>,
		private readonly jwtService: JwtService,
	) {
	}

	async signup(dto: PasswordSignupDto) {
		const {name, email, password} = dto;

		const genSalt = await bcrypt.genSalt(this.SALT_ROUND);
		const hashPassword = await bcrypt.hash(password.trim(), genSalt);

		try {
			await this.mongodbUserService.create({
				userId: uuidv4(),
				name: name.trim(),
				email: email.toLowerCase(),
				password: hashPassword,
				active: {
					code: nanoid(64),
				},
			});
		} catch (error) {
			if (error.code === 11000) {
				throw new BadRequestException('error_auth_00001');
			} else {
				throw new BadRequestException('error_auth_00000');
			}
		}

		return;
	}

	async signin(dto: PasswordSigninDto) {
		const user = await this.mongodbUserService.findOne({
			email: dto.email.toLowerCase(),
		});

		if (!user) throw new BadRequestException('error_auth_00005');
		if (!user.password) throw new BadRequestException('error_auth_00009');

		const validPassword = await bcrypt.compare(dto.password.trim(), user.password);

		if (!validPassword) throw new BadRequestException('error_auth_00005');
		if (!user.active.status) throw new BadRequestException('error_auth_00006');

		const accessToken = this.newAccessToken(user);
		const refreshToken = this.newRefreshToken(user);

		const payload = this.jwtService.decode(refreshToken) as IJwtPayload;

		await this.deleteExpRefreshToken(user);

		user.refreshTokens.push({
			value: refreshToken,
			exp: payload.exp,
		});

		user.save();

		return {accessToken, refreshToken,};
	}

	async renewToken(dto: RenewTokenDto) {
		let payload: IJwtPayload;
		try {
			payload = this.jwtService.verify(dto.refreshToken, {
				secret: process.env.JWT_SECRET_REFRESH_KEY,
			}) as IJwtPayload;
		} catch (e) {
			throw new BadRequestException('error_auth_00008');
		}

		const user = await this.mongodbUserService.findOne({
			userId: payload.userId,
		});

		if (!user) throw new BadRequestException('error_auth_00008');
		if (!user.active.status) throw new BadRequestException('error_auth_00008');

		const refreshTokenDb = user.refreshTokens.find((refreshToken) => {
			return refreshToken.value === dto.refreshToken;
		});
		if (!refreshTokenDb) throw new BadRequestException('error_auth_00008');
		if (refreshTokenDb.exp < new Date().getTime() / 1000) throw new BadRequestException('error_auth_00008');

		const accessToken = this.newAccessToken(user);
		const refreshToken = this.newRefreshToken(user);

		const newPayload = this.jwtService.decode(refreshToken) as IJwtPayload;

		await this.deleteExpRefreshToken(user);
		await this.deleteReRefreshToken(user, refreshTokenDb.value);

		user.refreshTokens.push({
			value: refreshToken,
			exp: newPayload.exp,
		});

		user.save();

		return {accessToken, refreshToken};
	}

	async changePassword(user: IJwtPayload, dto: ChangePasswordDto) {
		
	}

	private async deleteExpRefreshToken(user: User): Promise<void> {
		await this.mongodbUserService.updateOne(
			{userId: user.userId},
			{$pull: {refreshTokens: {exp: {$lt: new Date().getTime() / 1000}}}}
		);
	}

	private async deleteReRefreshToken(user: User, refreshToken: string): Promise<void> {
		await this.mongodbUserService.updateOne(
			{userId: user.userId},
			{$pull: {refreshTokens: {value: refreshToken}}}
		);
	}

	private newAccessToken(user: User): string {
		return this.jwtService.sign(
			{
				userId: user.userId,
			},
			{
				expiresIn: this.ONE_HOUR,
				secret: process.env.JWT_SECRET_KEY,
			},
		);
	}

	private newRefreshToken(user: User): string {
		return this.jwtService.sign(
			{
				userId: user.userId,
			},
			{
				expiresIn: this.SEVEN_DAYS,
				secret: process.env.JWT_SECRET_REFRESH_KEY,
			},
		);
	}
}
