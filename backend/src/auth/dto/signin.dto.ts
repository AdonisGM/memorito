import {IsEmail, IsNotEmpty} from "class-validator";

export class PasswordSigninDto {
  @IsEmail(undefined, {message: 'error_auth_00003'})
  @IsNotEmpty({message: 'error_auth_00003'})
  email: string

  @IsNotEmpty({message: 'error_auth_00002'})
  password: string
}