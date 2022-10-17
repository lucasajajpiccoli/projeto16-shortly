import { Router } from 'express';

import { authenticationMiddleware } from '../middlewares/auth.middleware.js';
import {
    insertUrlMiddleware,
    removeUrlMiddleware
} from '../middlewares/urls.middleware.js';

import {
    insert,
    list,
    open,
    remove
} from '../controllers/urls.controller.js';

const urlsRoute = Router();

urlsRoute.get('/urls/:id', list);
urlsRoute.get('/urls/open/:shortUrl', open);

urlsRoute.use(authenticationMiddleware);
urlsRoute.post('/urls/shorten', insertUrlMiddleware, insert);
urlsRoute.delete('/urls/:id', removeUrlMiddleware, remove);

export {
    urlsRoute
};