import { Router } from 'express';

import {
    signUpMiddleware,
    signInMiddleware
} from '../middlewares/auth.middleware.js';

import {
    signUp,
    signIn
} from '../controllers/auth.controller.js';

const authRoute = Router();

authRoute.post('/signup', signUpMiddleware, signUp);
authRoute.post('/signin', signInMiddleware, signIn);

export {
    authRoute
};