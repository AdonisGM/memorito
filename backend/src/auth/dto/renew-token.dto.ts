import { IsNotEmpty } from 'class-validator';

export class RenewTokenDto {
  @IsNotEmpty({ message: 'error_auth_00007' })
  refreshToken: string;
}
