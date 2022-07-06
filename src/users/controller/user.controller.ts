import { IUserController } from './user.interface';
import { BaseController } from '../../common/base.controller';
import { ENV_TYPE, TYPES } from '../../types';
import { ILogger } from '../../logger/logger.interface';
import { IUsersService } from '../service/users.service.interface';
import { ValidateMiddleware } from '../../common/validate.middleware';
import { UserLoginDto } from '../dto/user-login.dto';
import { HttpError } from '../../errors/http-error';
import { UserRegisterDto } from '../dto/user-register.dto';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { UserModal } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../../config/config.service.interface';
import { AuthGuard } from '../../common/auth.guard';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UsersService) private userService: IUsersService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);
		if (!result) {
			return next(new HttpError(401, 'no authorization', 'UserController-login'));
		}
		const secret = this.configService.get(ENV_TYPE.SECRET_JWT_TOKEN);
		const jwt = await this.signJWT(body.email, secret);
		this.ok<{ jwt: string }>(res, { jwt });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HttpError(422, 'user exists', 'UserController-register'));
		}
		this.ok<Omit<UserModal, 'password'>>(res, {
			email: result.email,
			name: result.name,
			id: result.id,
		});
	}

	async info(
		{ user }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.getUserInfo(user);
		if (!result) {
			return next(new HttpError(422, 'user does not exist', 'UserController-info'));
		}
		this.ok(res, { userId: result.id, name: result.name });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{ algorithm: 'HS256' },
				(err, encoded) => {
					if (err) {
						reject(err);
					} else {
						resolve(encoded as string);
					}
				},
			);
		});
	}
}
