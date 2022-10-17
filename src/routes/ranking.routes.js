import { Router } from 'express';

import { list } from '../controllers/ranking.controller.js';

const rankingRoute = Router();

rankingRoute.get('/ranking', list);

export {
    rankingRoute
};