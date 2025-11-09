import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import { AppError } from '../utils/appError';

export const validateRequest = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Solicitud invalida', 422, errors.array()));
  }

  next();
};
