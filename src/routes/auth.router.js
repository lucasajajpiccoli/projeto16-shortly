import { Router } from 'express';

import { signUpMiddleware } from '../middlewares/auth.middleware.js';

import { insertUser } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/signup', signUpMiddleware, insertUser);

export {
    authRouter
};