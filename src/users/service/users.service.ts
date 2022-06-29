import { IUsersService } from './users.service.interface';
import { ENV_TYPE, TYPES } from '../../types';
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
		const salt = this.configService.get(ENV_TYPE.SALT);
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			return null;
		}
		return await this.usersRepository.create(newUser);
	}

	async validateUser({ password, email }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
		return newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModal | null> {
		const existedUser = await this.usersRepository.find(email);
		if (!existedUser) {
			return null;
		}
		return existedUser;
	}
}
