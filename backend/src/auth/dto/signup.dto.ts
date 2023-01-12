import {IsString, IsEmail, IsNotEmpty, IsJWT, Matches} from 'class-validator';

export class PasswordSignupDto {
  @IsString({message: 'error-auth-00004'})
  @IsNotEmpty({message: 'error-auth-00004'})
  name: string;

  @IsEmail(undefined, {message: 'error-auth-00003'})
  @IsNotEmpty({message: 'error-auth-00003'})
  email: string;

  @IsString({message: 'error-auth-00002'})
  @IsNotEmpty({message: 'error-auth-00002'})
  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/, {
    message: 'error-auth-00002'
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
