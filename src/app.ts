import express, { Express, Request, Response, NextFunction } from 'express';
import {Server} from 'http'
import {LoggerService} from "./logger/logger.service";
import {UserController} from "./users/user.controller";
import {usersRouter} from "./users/userRouter";
import {ExceptionFilter} from "./errors/exception.filter";
import {ILogger} from "./logger/logger.interface";


export class App {
    app : Express;
    port : number;
    server : Server;
    logger : ILogger;
    userController : UserController;
    exceptionFilter : ExceptionFilter;

    constructor(logger : ILogger, userController : UserController, exceptionFilter : ExceptionFilter) {
        this.app = express();
        this.port = 8000;
        this.logger = logger;
        this.userController = userController;
        this.exceptionFilter = exceptionFilter;
    };

    useRoutes () {
        this.app.use('/users', this.userController.router)
    }

    useExceptionFilters () {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
    }

    public async init () {
        this.useRoutes()
        this.useExceptionFilters()
        this.server = this.app.listen(this.port)
        this.logger.log(`server start on http://localhost:${this.port}`)
    };
}
