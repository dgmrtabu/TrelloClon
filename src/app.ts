import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env';
import { authPlaceholder } from './middleware/authPlaceholder';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import taskRoutes from './routes/taskRoutes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.use(authPlaceholder);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(`/api/${env.apiVersion}/tasks`, taskRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'TrelloClon API, usa /api/v1/tasks' });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
