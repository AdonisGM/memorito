import { IsString, IsEmail, IsNotEmpty, IsJWT } from 'class-validator';

export class PasswordSignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
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