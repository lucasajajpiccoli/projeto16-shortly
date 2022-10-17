import { Router } from 'express';

import { authenticationMiddleware } from '../middlewares/auth.middleware.js';
import { usersMiddleware } from '../middlewares/users.middleware.js';

import { list } from '../controllers/users.controllers.js';

const usersRoute = Router();

usersRoute.get('/users/me', authenticationMiddleware, usersMiddleware, list);

export {
    usersRoute
};