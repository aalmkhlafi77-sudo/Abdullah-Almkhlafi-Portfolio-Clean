import type { RequestHandler } from 'express';

type AsyncRequestHandler = (...parameters: Parameters<RequestHandler>) => Promise<void>;

export const asyncHandler = (handler: AsyncRequestHandler): RequestHandler =>
  (req, res, next) => {
    void handler(req, res, next).catch(next);
  };
