import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../common/base.controller';

export interface IUserController extends BaseController {
	login: (req: Request, res: Response, next: NextFunction) => void;

	register: (req: Request, res: Response, next: NextFunction) => void;

	info: (req: Request, res: Response, next: NextFunction) => void;
}
