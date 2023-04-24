import {BadRequestException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {IJwtPayload} from "../auth/auth.interface";

@Injectable()
export class UserService {

  constructor(
    private readonly prisma: PrismaService,
  ) {
  }

  async getInformation(user: IJwtPayload) {
    const UserDb = await this.prisma.user.findFirst({
      select: {
        userId: true,
        email: true,
        name: true,
        avatar: true
      },
      where: {
        userId: user.userId,
      },
    });

    if (!UserDb) {
      throw new BadRequestException('');
    }

    return {
      ...UserDb
    };
  }
}
