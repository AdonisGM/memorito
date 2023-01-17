import {IsNotEmpty} from 'class-validator';

export class ChangePasswordDto {
	@IsNotEmpty({message: 'error_auth_00010'})
	oldPassword: string;

	@IsNotEmpty({message: 'error_auth_00011'})
	newPassword: string;
}