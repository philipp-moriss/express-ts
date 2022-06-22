import { UserRegisterDto } from '../dto/user-register.dto';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserModal } from '@prisma/client';

export interface IUsersService {
	createUser: (dto: UserRegisterDto) => Promise<UserModal | null>;

	validateUser: (dto: UserLoginDto) => boolean;
}
