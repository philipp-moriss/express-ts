import { UserModal } from '@prisma/client';
import { User } from '../entity/user.entity';

export interface IUsersRepository {
	create: (user: User) => Promise<UserModal>;

	find: (email: string) => Promise<UserModal | null>;
}
