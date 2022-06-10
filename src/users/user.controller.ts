import { BaseController } from '../common/base.controller';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/http-error';
import { ILogger } from '../logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from './user.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/login',
				method: 'get',
				func: this.login,
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
			},
		]);
	}

	login(req: Request, res: Response, next: NextFunction): void {
		// this.ok<string>(res, 'login')
		next(new HttpError(401, 'no autarization', 'login'));
	}

	register(req: Request, res: Response, next: NextFunction): void {
		this.ok<string>(res, 'register');
	}
}
