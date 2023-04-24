import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailjetService } from './mailjet/mailjet.service';
import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PermissionModule,
    UserModule,
  ],
  providers: [MailjetService],
})
export class AppModule {}
