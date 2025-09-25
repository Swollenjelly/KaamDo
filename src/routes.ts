import { Request, Response } from 'express';
import { Router } from 'express';
import authRoutes from './modules/auth/auth.controller';

export const routes = Router();
routes.use('/auth', authRoutes);


export interface HelloRouteRequest extends Request {}
export interface HelloRouteResponse extends Response {}

export const helloRoute = (req: HelloRouteRequest, res: HelloRouteResponse): void => {
    res.send('Hello from server!');
};

