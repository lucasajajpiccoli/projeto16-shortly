import { Router } from 'express';

import { authenticationMiddleware } from '../middlewares/auth.middleware.js';
import { urlsMiddleware } from '../middlewares/urls.middleware.js';

import {
    insert,
    list
} from '../controllers/urls.controller.js';

const urlsRoute = Router();

urlsRoute.post('/urls/shorten', authenticationMiddleware, urlsMiddleware, insert);
urlsRoute.get('/urls/:id', list);

export {
    urlsRoute
};
