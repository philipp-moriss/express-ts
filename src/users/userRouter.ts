import express , { Request, Response, NextFunction } from 'express';

const usersRouter = express.Router();

usersRouter.get('/users', ( req : Request, resp : Response ) => {

    resp.type('application/json');
    resp.send({users : [{name: 'philipp', age : 21}]});

});

export {usersRouter}
