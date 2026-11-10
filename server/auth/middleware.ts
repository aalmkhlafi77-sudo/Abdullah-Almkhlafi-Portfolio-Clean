import type { NextFunction, Request, Response } from 'express';

import type { AuthRepository } from './repository.js';
import { hashSessionToken, readSessionCookie } from './session.js';
import { asyncHandler } from '../http/asyncHandler.js';

export interface AuthDependencies {
  repository: AuthRepository;
  now?: () => Date;
}

export const requireAdmin = ({ repository, now = () => new Date() }: AuthDependencies) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rawToken = readSessionCookie(req.headers.cookie);
    if (!rawToken) {
      res.status(401).json({ error: 'AUTHENTICATION_REQUIRED' });
      return;
    }

    const tokenHash = hashSessionToken(rawToken);
    const session = await repository.findSession(tokenHash);
    if (!session || session.expiresAt.getTime() <= now().getTime()) {
      if (session) await repository.deleteSession(tokenHash);
      res.status(401).json({ error: 'AUTHENTICATION_REQUIRED' });
      return;
    }

    const admin = await repository.findAdminById(session.adminId);
    if (!admin?.isActive) {
      await repository.deleteSession(tokenHash);
      res.status(401).json({ error: 'AUTHENTICATION_REQUIRED' });
      return;
    }

    req.admin = { id: admin.id, username: admin.username };
    next();
  });
