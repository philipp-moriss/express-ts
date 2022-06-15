import { IUsersService } from './users.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { UserLoginDto } from './dto/user-login.dto';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class UsersService implements IUsersService {
	async createUser({ name, password, email }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		await newUser.setPassword(password);
		if (!newUser) {
			return null;
		}
		return newUser;
	}

	validateUser(dto: UserLoginDto): boolean {
		return true;
	}
}
