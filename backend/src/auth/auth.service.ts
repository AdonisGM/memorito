import {BadRequestException, Injectable} from '@nestjs/common';
import {nanoid} from 'nanoid';
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
import {JwtService} from '@nestjs/jwt';
import {IJwtPayload} from './auth.interface';
import moment from 'moment/moment';
import {PrismaService} from "../prisma/prisma.service";
import {Prisma} from "@prisma/client";
import {MailjetService} from "../mailjet/mailjet.service";

@Injectable()
export class AuthService {
  private readonly SALT_ROUND = 15;
  private readonly ONE_DAY = '1d';
  private readonly TWO_WEEKS = '2w';
  private readonly LENGTH_NANOID = 64;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailjetService: MailjetService,
  ) {
  }

  async signup(dto: PasswordSignupDto) {
    const {name, email, password} = dto;

    const hashedPassword = await this.hashPassword(password.trim());
    const activeCode = nanoid(this.LENGTH_NANOID);

    const data: Prisma.UserCreateInput = {
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      active: false,
      activeCode: activeCode,
      activeCodeExp: moment().utc().add(1, 'd').toDate(),
      createdAt: moment().utc().toDate(),
      updatedAt: moment().utc().toDate()
    };

    let resultData = undefined;
    try {
      resultData = await this.prisma.user.create({
        data: data,
      })
    } catch (error) {
      console.log(error)
      if (error.code === 'P2002') {
        throw new BadRequestException('error_auth_00001');
      } else {
        throw new BadRequestException('error_auth_00000');
      }
    }

    await this.mailjetService.sendVerifyAccount({
      userId: resultData.userId,
      code: activeCode,
      email: data.email,
      name: data.name,
    });

    return;
  }

  async signin(dto: PasswordSigninDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email.toLowerCase(),
      }
    });

    if (!user) throw new BadRequestException('error_auth_00005');
    if (!user.password) throw new BadRequestException('error_auth_00009');

    const validPassword = await bcrypt.compare(
      dto.password.trim(),
      user.password,
    );

    if (!validPassword) throw new BadRequestException('error_auth_00005');
    if (!user.active) throw new BadRequestException('error_auth_00006');

    const accessToken = this.newAccessToken(user);
    const refreshToken = this.newRefreshToken(user);

    const payload = this.jwtService.decode(refreshToken) as IJwtPayload;

    await this.deleteExpRefreshToken(user);
    const date = payload.exp * 1000;
    const data: Prisma.RefreshTokenCreateInput = {
      expires: moment(date).utc().toDate(),
      token: refreshToken,
      user: {
        connect: {
          userId: user.userId
        }
      }
    };
    await this.prisma.refreshToken.create({
      data: data
    })

    const role = await this.prisma.user.findFirst({
      where: {
        userId: user.userId,
      },
      select: {
        isAdmin: true,
        role: {
          select: {
            name: true,
            value: true,
            permissions: {
              select: {
                name: true,
                value: true
              }
            }
          }
        }
      }
    });

    return {accessToken, refreshToken, ...role};
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

    const user = await this.prisma.user.findFirst({
      where: {
        userId: payload.userId,
      }
    });

    if (!user) throw new BadRequestException('error_auth_00008');
    if (!user.active) throw new BadRequestException('error_auth_00008');

    const refreshTokenDb = await this.prisma.refreshToken.findFirst({
      where: {
        token: dto.refreshToken,
      }
    });
    if (!refreshTokenDb) throw new BadRequestException('error_auth_00008');
    if (refreshTokenDb.expires < moment().utc().toDate()) throw new BadRequestException('error_auth_00008');

    const accessToken = this.newAccessToken(user);
    const refreshToken = this.newRefreshToken(user);

    const newPayload = this.jwtService.decode(refreshToken) as IJwtPayload;

    await this.deleteExpRefreshToken(user);
    await this.deleteReRefreshToken(refreshTokenDb.token);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        expires: moment(newPayload.exp * 1000).utc().toDate(),
        user: {
          connect: {
            userId: user.userId
          }
        },
      } as Prisma.RefreshTokenCreateInput
    });

    return {accessToken, refreshToken};
  }

  async createPassword(user: IJwtPayload, dto: CreatePasswordDto) {
    const newPassword = dto.newPassword.trim();

    const userDb = await this.prisma.user.findFirst({
      where: {
        userId: user.userId,
      }
    });
    if (!userDb) throw new BadRequestException('error_auth_00016');
    if (userDb.password)
      throw new BadRequestException('error_auth_00016');

    await this.prisma.user.update({
      where: {
        userId: user.userId,
      },
      data: {
        password: await this.hashPassword(newPassword),
      }
    });

    return;
  }

  async changePassword(user: IJwtPayload, dto: ChangePasswordDto) {
    const oldPassword = dto.oldPassword.trim();
    const newPassword = dto.newPassword.trim();

    if (oldPassword === newPassword)
      throw new BadRequestException('error_auth_00012');

    const userDb = await this.prisma.user.findFirst({
      where: {
        userId: user.userId,
      }
    });
    if (!userDb) throw new BadRequestException('error_auth_00013');
    if (!userDb.password)
      throw new BadRequestException('error_auth_00014');

    const isCorrectOldPassword = await bcrypt.compare(
      oldPassword,
      userDb.password,
    );
    if (!isCorrectOldPassword)
      throw new BadRequestException('error_auth_00015');

    const accessToken = this.newAccessToken(userDb);
    const refreshToken = this.newRefreshToken(userDb);

    const newPayload = this.jwtService.decode(refreshToken) as IJwtPayload;

    await this.prisma.user.update({
      where: {
        userId: user.userId
      },
      data: {
        password: await this.hashPassword(newPassword),
      }
    })
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId: user.userId
      }
    })
    await this.prisma.refreshToken.create({
      data: {
        user: {
          connect: {
            userId: user.userId
          }
        },
        token: refreshToken,
        expires: moment(newPayload.exp * 1000).utc().toDate(),
      } as Prisma.RefreshTokenCreateInput
    })

    return {accessToken, refreshToken};
  }

  async activeAccount(dto: ActiveAccountDto) {
    const userId = dto.userId;
    const code = dto.code.trim();

    const userDb = await this.prisma.user.findFirst({
      where: {
        userId: userId,
      }
    });
    if (!userDb) throw new BadRequestException('error_auth_00018');
    if (userDb.active) throw new BadRequestException('error_auth_00019');
    if (userDb.activeCode !== code)
      throw new BadRequestException('error_auth_00017');
    if (userDb.activeCodeExp && userDb.activeCodeExp < moment().utc().toDate())
      throw new BadRequestException('error_auth_00017');
    else if (!userDb.activeCodeExp)
      throw new BadRequestException('error_auth_00017');

    await this.prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        active: true,
        activeCode: null,
        activeCodeExp: null,
      }
    })

    return;
  }

  async requestResetPassword(dto: ResetPasswordRequestDto) {
    const email = dto.email.trim();

    const userDb = await this.prisma.user.findFirst({
      where: {
        email: email
      }
    });
    if (!userDb) return new BadRequestException('error_auth_00020');

    const code = nanoid(64);

    await this.prisma.user.update({
      where: {
        userId: userDb.userId
      },
      data: {
        resetPasswordCode: code,
        resetPasswordCodeExp: moment().utc().add(1, 'd').toDate(),
      } as Prisma.UserUpdateInput
    });

    return;
  }

  async accuracyCodeResetPassword(dto: AccuracyPasswordRequestDto) {
    const userId = dto.userId.trim();
    const code = dto.code.trim();

    const userDb = await this.prisma.user.findFirst({
      where: {
        userId: userId
      }
    });
    if (!userDb) return new BadRequestException('error_auth_00021');

    const isValid =
      userDb.password === code &&
      userDb.resetPasswordCode &&
      userDb.resetPasswordCodeExp &&
      userDb.resetPasswordCodeExp >= moment().utc().toDate();
    if (!isValid) return new BadRequestException('error_auth_00021');

    return;
  }

  async resetPassword(dto: ResetPasswordDto) {
    const userId = dto.userId.trim();
    const code = dto.code.trim();
    const password = dto.password.trim();

    const userDb = await this.prisma.user.findFirst({
      where: {
        userId: userId
      }
    });
    if (!userDb) return new BadRequestException('error_auth_00022');

    const isValid =
      userDb.password === code &&
      userDb.resetPasswordCode &&
      userDb.resetPasswordCodeExp &&
      userDb.resetPasswordCodeExp >= moment().utc().toDate();
    if (!isValid) return new BadRequestException('error_auth_00022');

    await this.prisma.user.update({
      where: {
        userId: userId
      },
      data: {
        password: await this.hashPassword(password),
        resetPasswordCode: null,
        resetPasswordCodeExp: null,
      } as Prisma.UserUpdateInput
    })

    return;
  }

  async checkActive(user: IJwtPayload) {
    const userDb = await this.prisma.user.findFirst({
      where: {
        userId: user.userId,
      }
    });

    if (!userDb) throw new BadRequestException('error_auth_00006');
    if (!userDb.active)
      throw new BadRequestException('error_auth_00006');
  }

  private async deleteExpRefreshToken(user: Prisma.UserCreateInput): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId: user.userId,
        expires: {
          lt: moment().utc().toDate(),
        }
      }
    })
  }

  private async deleteReRefreshToken(
    refreshToken: string,
  ): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: {
        token: refreshToken,
      }
    })
  }

  private newAccessToken(user: Prisma.UserCreateInput): string {
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

  private newRefreshToken(user: Prisma.UserCreateInput): string {
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
