import express from 'express';
import cors from 'cors';

import { authRoute } from './routes/auth.routes.js';
import { urlsRoute } from './routes/urls.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use(authRoute);
app.use(urlsRoute);

export {
    app
};