import {IsNotEmpty, IsUUID} from 'class-validator';

export class ActiveAccountDto {
	@IsUUID('all', {message: 'error_auth_00017'})
	userId: string;

	@IsNotEmpty({message: 'error_auth_00017'})
	code: string;
}