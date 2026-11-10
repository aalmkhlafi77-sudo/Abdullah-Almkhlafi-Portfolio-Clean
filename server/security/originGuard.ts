import type { NextFunction, Request, Response } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export const originGuard = (publicOrigin: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (SAFE_METHODS.has(req.method.toUpperCase())) {
      next();
      return;
    }
    if (req.headers.origin !== publicOrigin) {
      res.status(403).json({ error: 'ORIGIN_FORBIDDEN' });
      return;
    }
    next();
  };
