import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { MailjetService } from '../mailjet/mailjet.service';
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailjetService, JwtStrategy],
})
export class AuthModule {}
