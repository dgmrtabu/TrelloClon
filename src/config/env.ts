import dotenv from 'dotenv';

dotenv.config();

const numberFromEnv = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: numberFromEnv(process.env.PORT, 4000),
  apiVersion: process.env.API_VERSION ?? 'v1'
};

export const isProduction = env.nodeEnv === 'production';
