import { Request, Response, NextFunction, Router } from 'express';

export interface IControllerRoute {
    path : string;
    func: ( req: Request, resp: Response, next:NextFunction ) => void;
    method : keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
}
