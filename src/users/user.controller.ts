import { BaseController } from "../common/base.controller";
import { Request, Response, NextFunction }  from "express";
import {HttpError} from "../errors/http-error";
import {ILogger} from "../logger/logger.interface";

export class UserController extends BaseController {

    constructor( logger : ILogger) {
        super(logger);
        this.bindRoutes([
            {
                path : '/login',
                method : 'get',
                func : this.login,
            },
            {
                path : '/register',
                method : 'post',
                func : this.register,
            }
        ])
    }

    login ( req: Request, res : Response, next : NextFunction )  {
        // this.ok<string>(res, 'login')
        next( new HttpError(401, 'no autarization', 'login'))
    }

    register ( req: Request, res : Response, next : NextFunction )  {
        this.ok<string>(res, 'register')
    }

}
