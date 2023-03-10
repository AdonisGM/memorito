import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import * as bcrypt from 'bcrypt';
import {
  AccuracyPasswordRequestDto,
  ActiveAccountDto,
  ChangePasswordDto,
  CreatePasswordDto,
  PasswordSigninDto,
  PasswordSignupDto,
  RenewTokenDto,
  ResetPasswordDto,
  ResetPasswordRequestDto,
} from './dto';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';
import { IJwtPayload } from './auth.interface';
import moment from 'moment/moment';

@Injectable()
export class AuthService {
  private readonly SALT_ROUND = 15;
  private readonly ONE_DAY = '1d';
  private readonly TWO_WEEKS = '2w';
  private readonly LENGTH_NANOID = 64;

  constructor(
    @InjectModel(User.name) private mongodbUserService: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {
  }

  async signup(dto: PasswordSignupDto) {
    const { name, email, password } = dto;

    const hashedPassword = await this.hashPassword(password.trim());
    const codeResetPassword = nanoid(this.LENGTH_NANOID);

    try {
      await this.mongodbUserService.create({
        userId: uuidv4(),
        name: name.trim(),
        email: email.toLowerCase(),
        password: {
          value: hashedPassword,
        },
        active: {
          code: nanoid(this.LENGTH_NANOID),
          exp: moment().utc().add(1, 'd').toDate(),
        },
        codeResetPassword: codeResetPassword,
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
    if (!user.password.value) throw new BadRequestException('error_auth_00009');

    const validPassword = await bcrypt.compare(
      dto.password.trim(),
      user.password.value,
    );

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

    return { accessToken, refreshToken };
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
    if (refreshTokenDb.exp < moment().utc().toDate().getTime() / 1000)
      throw new BadRequestException('error_auth_00008');

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

    return { accessToken, refreshToken };
  }

  async createPassword(user: IJwtPayload, dto: CreatePasswordDto) {
    const newPassword = dto.newPassword.trim();

    const userDb = await this.mongodbUserService.findOne({
      userId: user.userId,
    });
    if (!userDb) throw new BadRequestException('error_auth_00016');
    if (userDb.password.value)
      throw new BadRequestException('error_auth_00016');

    userDb.password.value = await this.hashPassword(newPassword);
    await userDb.save();

    return;
  }

  async changePassword(user: IJwtPayload, dto: ChangePasswordDto) {
    const oldPassword = dto.oldPassword.trim();
    const newPassword = dto.newPassword.trim();

    if (oldPassword === newPassword)
      throw new BadRequestException('error_auth_00012');

    const userDb = await this.mongodbUserService.findOne({
      userId: user.userId,
    });
    if (!userDb) throw new BadRequestException('error_auth_00013');
    if (!userDb.password.value)
      throw new BadRequestException('error_auth_00014');

    const isCorrectOldPassword = await bcrypt.compare(
      oldPassword,
      userDb.password.value,
    );
    if (!isCorrectOldPassword)
      throw new BadRequestException('error_auth_00015');

    const accessToken = this.newAccessToken(userDb);
    const refreshToken = this.newRefreshToken(userDb);

    const newPayload = this.jwtService.decode(refreshToken) as IJwtPayload;

    userDb.password.value = await this.hashPassword(oldPassword);
    userDb.refreshTokens = [{ value: refreshToken, exp: newPayload.exp }];
    await userDb.save();

    return { accessToken, refreshToken };
  }

  async activeAccount(dto: ActiveAccountDto) {
    const userId = dto.userId;
    const code = dto.code.trim();

    const userDb = await this.mongodbUserService.findOne({ userId: userId });
    if (!userDb) throw new BadRequestException('error_auth_00018');
    if (userDb.active.status) throw new BadRequestException('error_auth_00019');
    if (userDb.active.code !== code)
      throw new BadRequestException('error_auth_00017');
    if (userDb.active.exp < moment().utc().toDate())
      throw new BadRequestException('error_auth_00017');

    userDb.active.status = true;
    await userDb.save();

    return;
  }

  async requestResetPassword(dto: ResetPasswordRequestDto) {
    const email = dto.email.trim();

    const userDb = await this.mongodbUserService.findOne({ email: email });
    if (!userDb) return new BadRequestException('error_auth_00020');

    const code = nanoid(64);
    //TODO: send email to user

    userDb.password.code = code;
    userDb.password.expCode = moment().utc().add(1, 'd').toDate();

    await userDb.save();

    return;
  }

  async accuracyCodeResetPassword(param: AccuracyPasswordRequestDto) {
    const userId = param.userId.trim();
    const code = param.code.trim();

    const userDb = await this.mongodbUserService.findOne({ userId: userId });
    if (!userDb) return new BadRequestException('error_auth_00021');

    const isValid =
      userDb.password.code === code &&
      userDb.password.expCode &&
      userDb.password.expCode >= moment().utc().toDate();
    if (!isValid) return new BadRequestException('error_auth_00021');

    return;
  }

  async resetPassword(dto: ResetPasswordDto) {
    const userId = dto.userId.trim();
    const code = dto.code.trim();
    const password = dto.password.trim();

    const userDb = await this.mongodbUserService.findOne({ userId: userId });
    if (!userDb) return new BadRequestException('error_auth_00022');

    const isValid =
      userDb.password.code === code &&
      userDb.password.expCode &&
      userDb.password.expCode >= moment().utc().toDate();
    if (!isValid) return new BadRequestException('error_auth_00022');

    userDb.password = {
      value: await this.hashPassword(password),
      code: undefined,
      expCode: undefined,
    };
    userDb.refreshTokens = [];
    userDb.save();

    return;
  }

  async checkActive(user: IJwtPayload) {
    const userDb = await this.mongodbUserService.findOne({
      userId: user.userId,
    });

    if (!userDb) throw new BadRequestException('error_auth_00006');
    if (!userDb.active.status)
      throw new BadRequestException('error_auth_00006');
  }

  private async deleteExpRefreshToken(user: User): Promise<void> {
    await this.mongodbUserService.updateOne(
      { userId: user.userId },
      {
        $pull: {
          refreshTokens: {
            exp: { $lt: moment().utc().toDate().getTime() / 1000 },
          },
        },
      },
    );
  }

  private async deleteReRefreshToken(
    user: User,
    refreshToken: string,
  ): Promise<void> {
    await this.mongodbUserService.updateOne(
      { userId: user.userId },
      { $pull: { refreshTokens: { value: refreshToken } } },
    );
  }

  private newAccessToken(user: User): string {
    return this.jwtService.sign(
      {
        userId: user.userId,
      },
      {
        expiresIn: this.ONE_DAY,
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
        expiresIn: this.TWO_WEEKS,
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      },
    );
  }

  private async hashPassword(rawPassword: string): Promise<string> {
    const genSalt = await bcrypt.genSalt(this.SALT_ROUND);
    return bcrypt.hash(rawPassword.trim(), genSalt);
  }
}
