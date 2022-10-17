import { Router } from 'express';

import { authRoute } from './auth.routes.js';
import { urlsRoute } from './urls.routes.js';
import { usersRoute } from './users.routes.js';
import { rankingRoute } from './ranking.routes.js';

const router = Router();

router.use(authRoute);
router.use(urlsRoute);
router.use(usersRoute);
router.use(rankingRoute);

export {
    router
};