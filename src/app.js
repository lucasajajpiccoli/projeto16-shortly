import express from 'express';
import cors from 'cors';

import { authRouter } from './routes/auth.router.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use(authRouter);

export {
    app
};