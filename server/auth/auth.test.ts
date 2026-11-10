import assert from 'node:assert/strict';
import test from 'node:test';

import express from 'express';
import request from 'supertest';

import { hashPassword, verifyPassword } from './password.js';
import type { AdminRecord, AuthRepository, StoredSession } from './repository.js';
import { createAuthRouter } from './routes.js';
import { hashSessionToken, SESSION_COOKIE_NAME } from './session.js';
import { requireAdmin } from './middleware.js';

class MemoryAuthRepository implements AuthRepository {
  admins: AdminRecord[] = [];
  sessions: StoredSession[] = [];

  async findAdminByUsername(username: string) {
    return this.admins.find((admin) => admin.username === username) ?? null;
  }
  async findAdminById(id: number) {
    return this.admins.find((admin) => admin.id === id) ?? null;
  }
  async createAdmin(input: Omit<AdminRecord, 'id'>) {
    const admin = { ...input, id: this.admins.length + 1 };
    this.admins.push(admin);
    return admin;
  }
  async createSession(session: StoredSession) {
    this.sessions.push(session);
  }
  async findSession(tokenHash: string) {
    return this.sessions.find((session) => session.tokenHash === tokenHash) ?? null;
  }
  async deleteSession(tokenHash: string) {
    this.sessions = this.sessions.filter((session) => session.tokenHash !== tokenHash);
  }
  async deleteSessionsForAdmin(adminId: number) {
    this.sessions = this.sessions.filter((session) => session.adminId !== adminId);
  }
  async updatePassword(adminId: number, passwordHash: string) {
    const admin = this.admins.find((candidate) => candidate.id === adminId);
    if (admin) admin.passwordHash = passwordHash;
  }
  async markLogin() {}
}

const makeApp = (repository: MemoryAuthRepository, now = () => new Date('2026-10-04T12:00:00Z')) => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', createAuthRouter({ repository, now }));
  app.get('/protected', requireAdmin({ repository, now }), (req, res) => {
    res.json({ admin: req.admin });
  });
  return app;
};

const seededRepository = async () => {
  const repository = new MemoryAuthRepository();
  repository.admins.push({
    id: 1,
    username: 'abdullah',
    passwordHash: await hashPassword('correct-horse-battery-staple'),
    isActive: true,
  });
  return repository;
};

test('valid login creates only a hashed server session and a hardened cookie', async () => {
  const repository = await seededRepository();
  const response = await request(makeApp(repository))
    .post('/api/auth/login')
    .send({ username: 'abdullah', password: 'correct-horse-battery-staple' });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body.admin, { id: 1, username: 'abdullah' });
  assert.equal(repository.sessions.length, 1);
  assert.match(repository.sessions[0].tokenHash, /^[a-f0-9]{64}$/);
  const cookie = response.headers['set-cookie'][0];
  assert.match(cookie, new RegExp(`^${SESSION_COOKIE_NAME}=`));
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /Secure/i);
  assert.match(cookie, /SameSite=Strict/i);
  assert.match(cookie, /Max-Age=28800/i);
});

test('wrong password and unknown username return the same response', async () => {
  const repository = await seededRepository();
  const app = makeApp(repository);
  const wrong = await request(app).post('/api/auth/login').send({ username: 'abdullah', password: 'wrong' });
  const unknown = await request(app).post('/api/auth/login').send({ username: 'nobody', password: 'wrong' });

  assert.equal(wrong.status, 401);
  assert.equal(unknown.status, 401);
  assert.deepEqual(wrong.body, unknown.body);
  assert.deepEqual(wrong.body, { error: 'INVALID_CREDENTIALS' });
});

test('protected routes reject a missing or expired session cookie', async () => {
  const repository = await seededRepository();
  repository.sessions.push({
    adminId: 1,
    tokenHash: hashSessionToken('expired-token'),
    expiresAt: new Date('2026-10-04T11:59:59Z'),
  });
  const app = makeApp(repository);

  assert.equal((await request(app).get('/protected')).status, 401);
  assert.equal((await request(app).get('/protected').set('Cookie', `${SESSION_COOKIE_NAME}=expired-token`)).status, 401);
});

test('logout invalidates the current session', async () => {
  const repository = await seededRepository();
  const app = makeApp(repository);
  const login = await request(app).post('/api/auth/login').send({
    username: 'abdullah', password: 'correct-horse-battery-staple',
  });
  const cookie = login.headers['set-cookie'][0].split(';')[0];

  const logout = await request(app).post('/api/auth/logout').set('Cookie', cookie);
  assert.equal(logout.status, 204);
  assert.match(logout.headers['set-cookie'][0], /Expires=Thu, 01 Jan 1970/i);
  assert.doesNotMatch(logout.headers['set-cookie'][0], /Max-Age=28800/i);
  assert.equal(repository.sessions.length, 0);
  assert.equal((await request(app).get('/protected').set('Cookie', cookie)).status, 401);
});

test('changing password invalidates every admin session and stores a hash', async () => {
  const repository = await seededRepository();
  const app = makeApp(repository);
  const firstLogin = await request(app).post('/api/auth/login').send({
    username: 'abdullah', password: 'correct-horse-battery-staple',
  });
  await request(app).post('/api/auth/login').send({
    username: 'abdullah', password: 'correct-horse-battery-staple',
  });
  const cookie = firstLogin.headers['set-cookie'][0].split(';')[0];

  const changed = await request(app)
    .put('/api/auth/password')
    .set('Cookie', cookie)
    .send({ currentPassword: 'correct-horse-battery-staple', newPassword: 'new-password-at-least-12' });

  assert.equal(changed.status, 204);
  assert.equal(repository.sessions.length, 0);
  assert.equal(await verifyPassword('new-password-at-least-12', repository.admins[0].passwordHash), true);
  assert.equal(repository.admins[0].passwordHash.includes('new-password-at-least-12'), false);
});
