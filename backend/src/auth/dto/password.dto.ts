import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'error_auth_00010' })
  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/, {
    message: 'error_auth_00002',
  })
  oldPassword: string;

  @IsNotEmpty({ message: 'error_auth_00011' })
  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/, {
    message: 'error_auth_00002',
  })
  newPassword: string;
}

export class CreatePasswordDto {
  @IsNotEmpty({ message: 'error_auth_00011' })
  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/, {
    message: 'error_auth_00002',
  })
  newPassword: string;
}

export class ResetPasswordRequestDto {
  @IsEmail(undefined, { message: 'error_auth_00003' })
  @IsNotEmpty({ message: 'error_auth_00003' })
  email: string;
}

export class AccuracyPasswordRequestDto {
  @IsNotEmpty({ message: 'error_auth_00021' })
  userId: string;

  @IsNotEmpty({ message: 'error_auth_00021' })
  code: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'error_auth_00022' })
  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/, {
    message: 'error_auth_00022',
  })
  password: string;

  @IsNotEmpty({ message: 'error_auth_00022' })
  userId: string;

  @IsNotEmpty({ message: 'error_auth_00022' })
  code: string;
}
