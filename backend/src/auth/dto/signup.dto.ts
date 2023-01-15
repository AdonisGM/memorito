import {IsString, IsEmail, IsNotEmpty, IsJWT, Matches} from 'class-validator';

export class PasswordSignupDto {
  @IsString({message: 'error_auth_00004'})
  @IsNotEmpty({message: 'error_auth_00004'})
  name: string;

  @IsEmail(undefined, {message: 'error_auth_00003'})
  @IsNotEmpty({message: 'error_auth_00003'})
  email: string;

  @IsString({message: 'error_auth_00002'})
  @IsNotEmpty({message: 'error_auth_00002'})
  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/, {
    message: 'error_auth_00002'
  })
  password: string;
}

export class GoogleSignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsJWT()
  @IsNotEmpty()
  token: string;
}
