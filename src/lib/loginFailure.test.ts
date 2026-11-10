import assert from 'node:assert/strict';
import test from 'node:test';

import { ApiError, ApiSessionExpiredError } from './apiClient.js';
import { getLoginFailureMessage } from './loginFailure.js';

test('reports invalid credentials only for an authentication rejection', () => {
  assert.match(getLoginFailureMessage(new ApiSessionExpiredError()), /اسم المستخدم أو كلمة المرور/);
});

test('explains an origin mismatch instead of blaming credentials', () => {
  assert.match(getLoginFailureMessage(new ApiError(403, 'ORIGIN_FORBIDDEN')), /عنوان الموقع/);
});

test('explains the login rate limit instead of blaming credentials', () => {
  assert.match(getLoginFailureMessage(new ApiError(429, 'REQUEST_FAILED')), /15 دقيقة/);
});

test('reports server and network failures without claiming the password is wrong', () => {
  for (const error of [new ApiError(500, 'INTERNAL_ERROR'), new TypeError('Failed to fetch')]) {
    assert.doesNotMatch(getLoginFailureMessage(error), /كلمة المرور غير صحيحة/);
    assert.match(getLoginFailureMessage(error), /الخادم|الاتصال/);
  }
});
