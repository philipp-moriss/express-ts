import { UsersService } from './users.service';
import 'reflect-metadata';
import { Container } from 'inversify';
import { IUsersService } from './users.service.interface';
import { TYPES } from '../../types';
import { IConfigService } from '../../config/config.service.interface';
import { IUsersRepository } from '../repository/users.repository.interface';
import { User } from '../entity/user.entity';
import { UserModal } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	create: jest.fn(),
	find: jest.fn(),
};

const container: Container = new Container();

let usersRepository: IUsersRepository;
let configService: IConfigService;
let usersService: IUsersService;

let createUser: UserModal | null;

beforeAll(() => {
	container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	usersService = container.get<IUsersService>(TYPES.UsersService);
	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
});

describe('User Service', () => {
	it('Test Create User', async () => {
		configService.get = jest.fn().mockReturnValueOnce('10');
		usersRepository.create = jest.fn().mockImplementationOnce((user: User): UserModal => {
			return {
				name: user.name,
				password: user.password,
				email: user.email,
				id: 1,
			};
		});
		createUser = await usersService.createUser({
			name: 'philipp',
			email: 'fil@gmail.com',
			password: '1111',
		});

		expect(createUser?.id).toEqual(1);
		expect(createUser?.email).toEqual('fil@gmail.com');
		expect(createUser?.password).not.toEqual('1111');
	});

	it('Validate User - success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createUser);
		const result = await usersService.validateUser({ password: '1111', email: 'fil@gmail.com' });
		expect(result).toBeTruthy();
	});

	it('Validate User - reject', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createUser);
		const result = await usersService.validateUser({ password: '111', email: 'fil@gmail.com' });
		expect(result).toBeFalsy();
	});

	it('Validate User - not found', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const result = await usersService.validateUser({ password: '111', email: 'fil@gmail.com' });
		expect(result).toBeFalsy();
	});
});
