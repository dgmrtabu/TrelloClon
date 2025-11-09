import app from './app';
import { env } from './config/env';
import { getDb } from './db/connection';

const bootstrap = async (): Promise<void> => {
  await getDb();

  app.listen(env.port, () => {
    console.log(`Server ready on http://localhost:${env.port} (env: ${env.nodeEnv})`);
  });
};

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exitCode = 1;
});
