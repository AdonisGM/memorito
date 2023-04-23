import {Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {PrismaModule} from "../prisma/prisma.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {
}
