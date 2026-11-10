import cookieParser from 'cookie-parser';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { requireAdmin } from './middleware.js';
import { hashPassword, verifyPassword } from './password.js';
import type { AuthRepository } from './repository.js';
import {
  createSessionToken,
  clearSessionCookieOptions,
  hashSessionToken,
  readSessionCookie,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
  sessionCookieOptions,
} from './session.js';
import { asyncHandler } from '../http/asyncHandler.js';

export interface AuthRouterDependencies {
  repository: AuthRepository;
  now?: () => Date;
}

const invalidCredentials = { error: 'INVALID_CREDENTIALS' };
const DUMMY_PASSWORD_HASH = '$2b$12$KIXQxQ2eN4dmdpCdoOcEge6D4ZcG0cBhMPd9FfGpm2t8bH4pxSJmK';

export const createAuthRouter = ({ repository, now = () => new Date() }: AuthRouterDependencies): Router => {
  const router = Router();
  router.use(cookieParser());

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
  });

  router.post('/login', loginLimiter, asyncHandler(async (req, res) => {
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const admin = username ? await repository.findAdminByUsername(username) : null;
    const matches = await verifyPassword(password, admin?.passwordHash ?? DUMMY_PASSWORD_HASH);
    if (!admin?.isActive || !matches) {
      res.status(401).json(invalidCredentials);
      return;
    }

    const { rawToken, tokenHash } = createSessionToken();
    await repository.createSession({
      adminId: admin.id,
      tokenHash,
      expiresAt: new Date(now().getTime() + SESSION_DURATION_MS),
    });
    await repository.markLogin(admin.id);
    res.cookie(SESSION_COOKIE_NAME, rawToken, sessionCookieOptions);
    res.json({ admin: { id: admin.id, username: admin.username } });
  }));

  router.get('/me', requireAdmin({ repository, now }), (req, res) => {
    res.json({ admin: req.admin });
  });

  router.post('/logout', asyncHandler(async (req, res) => {
    const rawToken = readSessionCookie(req.headers.cookie);
    if (rawToken) await repository.deleteSession(hashSessionToken(rawToken));
    res.clearCookie(SESSION_COOKIE_NAME, clearSessionCookieOptions);
    res.status(204).end();
  }));

  router.put('/password', requireAdmin({ repository, now }), asyncHandler(async (req, res) => {
    const currentPassword = typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
    const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
    const admin = req.admin ? await repository.findAdminById(req.admin.id) : null;
    const currentMatches = admin ? await verifyPassword(currentPassword, admin.passwordHash) : false;
    if (!admin || !currentMatches) {
      res.status(401).json(invalidCredentials);
      return;
    }
    if (newPassword.length < 12) {
      res.status(400).json({ error: 'PASSWORD_TOO_SHORT' });
      return;
    }

    await repository.updatePassword(admin.id, await hashPassword(newPassword));
    await repository.deleteSessionsForAdmin(admin.id);
    res.clearCookie(SESSION_COOKIE_NAME, clearSessionCookieOptions);
    res.status(204).end();
  }));

  return router;
};
