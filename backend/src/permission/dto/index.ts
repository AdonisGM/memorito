import {IsEmpty, IsNotEmpty, IsUUID, Length} from "class-validator";

export class CreatePermissionDto {
  @Length(1, 255, {message: 'error_auth_00023'})
  @IsNotEmpty({message: 'error_auth_00023'})
  name: string;

  @Length(1, 255, {message: 'error_auth_00024'})
  @IsNotEmpty({message: 'error_auth_00024'})
  value: string;
}

export class UpdatePermissionDto {
  @IsUUID('all', {message: 'error_auth_00025'})
  permissionId: string;

  @Length(1, 255, {message: 'error_auth_00023'})
  @IsNotEmpty({message: 'error_auth_00023'})
  name: string;

  @Length(1, 255, {message: 'error_auth_00024'})
  @IsNotEmpty({message: 'error_auth_00024'})
  value: string;
}

export class CreateRoleDto {
  @Length(1, 255, {message: 'error_auth_00027'})
  @IsNotEmpty({message: 'error_auth_00027'})
  name: string;

  @Length(1, 255, {message: 'error_auth_00028'})
  @IsNotEmpty({message: 'error_auth_00028'})
  value: string;

  @Length(0, 255, {message: 'error_auth_00029'})
  description: string;
}

export class UpdateRoleDto {
  @IsUUID('all', {message: 'error_auth_00031'})
  roleId: string;

  @Length(1, 255, {message: 'error_auth_00027'})
  @IsNotEmpty({message: 'error_auth_00027'})
  name: string;

  @Length(1, 255, {message: 'error_auth_00028'})
  @IsNotEmpty({message: 'error_auth_00028'})
  value: string;

  @Length(1, 255, {message: 'error_auth_00029'})
  @IsEmpty({message: 'error_auth_00029'})
  description: string;
}

export class AddPermissionToRoleDto {
  @IsUUID('all', {each: true})
  permissions: string[]

  @IsUUID('all', {message: 'error_auth_00031'})
  role: string
}

export class AssignUserToRoleDto {
  @IsUUID('all', {message: 'error_auth_00031'})
  role: string

  @IsUUID('all', {each: true})
  users: string[]
}