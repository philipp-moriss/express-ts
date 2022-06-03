import express, { Express, Request, Response, NextFunction } from 'express';
import {usersRouter} from './users/userRouter.js'
import {Server} from 'http'

export class App {
    app : Express;
    port : number;
    server : Server;

    constructor() {
        this.app = express();
        this.port = 8000;
    };

    useRoutes () {
        this.app.use('/users', usersRouter)
    }

    public async init () {
        this.useRoutes()
        this.server = this.app.listen(this.port)
        console.log(`server start on port : ${this.port}`)
    };
}
