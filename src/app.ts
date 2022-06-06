import express, { Express, Request, Response, NextFunction } from 'express';
import {Server} from 'http'
import {LoggerService} from "./logger/logger.service";
import {UserController} from "./users/user.controller";
import {usersRouter} from "./users/userRouter";


export class App {
    app : Express;
    port : number;
    server : Server;
    logger : LoggerService
    userController : UserController

    constructor(logger : LoggerService, userController : UserController) {
        this.app = express();
        this.port = 8000;
        this.logger = logger
        this.userController = userController
    };

    useRoutes () {
        this.app.use('/users', this.userController.router)
    }

    public async init () {
        this.useRoutes()
        this.server = this.app.listen(this.port)
        this.logger.log(`server start on http://localhost:${this.port}`)
    };
}
