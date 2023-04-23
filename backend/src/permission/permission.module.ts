import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
  ],
  providers: [PermissionService],
  controllers: [PermissionController]
})
export class PermissionModule {}
