import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'not correct Email' })
	email: string;

	@IsString({ message: 'not inner password' })
	password: string;

	@IsString({ message: 'not inner name' })
	name: string;
}
