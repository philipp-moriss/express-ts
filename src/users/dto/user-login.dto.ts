import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'not correct Email' })
	email: string;
	@IsString({ message: 'not inner password' })
	password: string;
}
