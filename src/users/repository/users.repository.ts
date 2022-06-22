import { IUsersRepository } from './users.repository.interface';
import { UserModal } from '@prisma/client';
import { TYPES } from '../../types';
import { IPrismaService } from '../../database/prisma.service.interface';
import { User } from '../entity/user.entity';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: IPrismaService) {}
	async create({ email, name, password }: User): Promise<UserModal> {
		return this.prismaService.client.userModal.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	async find(email: string): Promise<UserModal | null> {
		return this.prismaService.client.userModal.findFirst({
			where: {
				email,
			},
		});
	}
}
