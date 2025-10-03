import express from 'express';
import cors from 'cors';
import * as routes from './routes';
import { errorHandler } from './middleware/error';


const app = express();
app.use(cors());
app.use(express.json());


app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', routes.routes);
app.use(errorHandler);


export default app;

// http://localhost:4000/ api/auth/register