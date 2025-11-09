import { Request, Response, NextFunction } from 'express';

export const authPlaceholder = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.header('x-api-key');

  if (!apiKey) {
    console.warn('Auth placeholder: ninguna API key provista. En produccion validar credenciales reales.');
  }

  res.locals.user = { id: 'demo-user', permissions: ['tasks:read', 'tasks:write'] };
  next();
};
