import {IsEmail, IsNotEmpty} from "class-validator";

export class PasswordSigninDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string
}