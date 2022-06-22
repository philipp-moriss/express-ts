import { IUsersService } from './users.service.interface';
import { TYPES } from '../../types';
import { IConfigService } from '../../config/config.service.interface';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../entity/user.entity';
import { UserLoginDto } from '../dto/user-login.dto';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IUsersRepository } from '../repository/users.repository.interface';
import { UserModal } from '@prisma/client';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser({ name, password, email }: UserRegisterDto): Promise<UserModal | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			return null;
		}
		return await this.usersRepository.create(newUser);
	}

	validateUser(dto: UserLoginDto): boolean {
		return true;
	}
}
