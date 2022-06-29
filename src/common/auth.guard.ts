import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';

export class AuthGuard implements IMiddleware {
	execute(req: Request, resp: Response, next: NextFunction): void {
		if (req.user) {
			return next();
		}
		resp.status(401).send({ error: 'User no authorization' });
	}
}
