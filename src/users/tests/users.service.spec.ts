import { Container } from 'inversify';
import { IConfigService } from '../../config/config.service.interface';
import { IUsersRepository } from '../repository/users.repository.interface';
import { IUsersService } from '../service/users.service.interface';
import { TYPES } from '../../types';
import { UsersService } from '../service/users.service';
import { User } from '../entity/user.entity';
import { UserModal } from '@prisma/client';
import 'reflect-metadata';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();

let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUsersService;

beforeAll(() => {
	container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUsersService>(TYPES.UsersService);
});

describe('User service', () => {
	it('create user', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce((user: User): UserModal => {
			return {
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			};
		});
		const createdUser = await usersService.createUser({
			email: 'test@gmail.com',
			name: 'test',
			password: '11111111',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('11111111');
	});
});
