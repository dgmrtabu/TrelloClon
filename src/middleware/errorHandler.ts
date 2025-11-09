import { Request, Response, NextFunction } from 'express';

import { AppError } from '../utils/appError';
import { isProduction } from '../config/env';

export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction): void => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const basePayload = {
    message: error.message || 'Error interno del servidor'
  };

  const metadata = error instanceof AppError && error.details ? { details: error.details } : {};
  const stack = isProduction ? {} : { stack: error.stack };

  res.status(statusCode).json({ error: { ...basePayload, ...metadata, ...stack } });
};
