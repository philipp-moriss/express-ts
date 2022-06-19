import { IUsersService } from './users.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { UserLoginDto } from './dto/user-login.dto';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class UsersService implements IUsersService {
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}

	async createUser({ name, password, email }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		if (!newUser) {
			return null;
		}
		return newUser;
	}

	validateUser(dto: UserLoginDto): boolean {
		return true;
	}
}
