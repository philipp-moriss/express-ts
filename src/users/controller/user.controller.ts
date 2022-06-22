import { IUserController } from './user.interface';
import { BaseController } from '../../common/base.controller';
import { TYPES } from '../../types';
import { ILogger } from '../../logger/logger.interface';
import { IUsersService } from '../service/users.service.interface';
import { ValidateMiddleware } from '../../common/validate.middleware';
import { UserLoginDto } from '../dto/user-login.dto';
import { HttpError } from '../../errors/http-error';
import { UserRegisterDto } from '../dto/user-register.dto';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { UserModal } from '@prisma/client';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UsersService) private userService: IUsersService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				func: this.login,
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);
	}

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		console.log(req.body);
		this.ok<string>(res, 'login');
		//next(new HttpError(401, 'no autarization', 'login'));
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HttpError(422, 'user exists', 'UserController'));
		}
		this.ok<Omit<UserModal, 'password'>>(res, {
			email: result.email,
			name: result.name,
			id: result.id,
		});
	}
}
