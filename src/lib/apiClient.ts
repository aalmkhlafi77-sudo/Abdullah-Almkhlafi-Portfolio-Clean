import type { PortfolioSnapshotV1 } from '../../server/content/schema.js';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message = code,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiConflictError extends ApiError {
  constructor(public readonly currentVersion: number) {
    super(409, 'CONTENT_CONFLICT');
    this.name = 'ApiConflictError';
  }
}

export class ApiSessionExpiredError extends ApiError {
  constructor() {
    super(401, 'AUTHENTICATION_REQUIRED');
    this.name = 'ApiSessionExpiredError';
  }
}

interface DraftResponse {
  snapshot: PortfolioSnapshotV1;
  draftVersion: number;
}

interface PublishedResponse {
  snapshot: PortfolioSnapshotV1;
  publishedVersion: number;
  publishedAt: string;
}

interface AdminResponse {
  admin: { id: number; username: string };
}

const parseBody = async (response: Response): Promise<Record<string, unknown>> => {
  if (response.status === 204) return {};
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) return {};
  return await response.json() as Record<string, unknown>;
};

export const createApiClient = (
  fetcher: typeof fetch = fetch,
  baseUrl = '',
) => {
  const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
    const isFormData = typeof FormData !== 'undefined' && init.body instanceof FormData;
    const response = await fetcher(`${baseUrl}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        ...(isFormData ? {} : init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    });
    const body = await parseBody(response);
    if (!response.ok) {
      if (response.status === 409) throw new ApiConflictError(Number(body.currentVersion));
      if (response.status === 401) throw new ApiSessionExpiredError();
      throw new ApiError(response.status, String(body.error ?? 'REQUEST_FAILED'));
    }
    return body as T;
  };

  return {
    publicContent: () => request<PublishedResponse>('/api/public/content'),
    login: (username: string, password: string) => request<AdminResponse>('/api/auth/login', {
      method: 'POST', body: JSON.stringify({ username, password }),
    }),
    logout: () => request<void>('/api/auth/logout', { method: 'POST' }),
    me: () => request<AdminResponse>('/api/auth/me'),
    getDraft: () => request<DraftResponse>('/api/admin/content/draft'),
    saveDraft: (snapshot: PortfolioSnapshotV1, expectedDraftVersion: number) =>
      request<DraftResponse>('/api/admin/content/draft', {
        method: 'PUT', body: JSON.stringify({ snapshot, expectedDraftVersion }),
      }),
    publish: (expectedDraftVersion: number, note?: string) =>
      request<PublishedResponse>('/api/admin/content/publish', {
        method: 'POST', body: JSON.stringify({ expectedDraftVersion, note }),
      }),
    restoreVersion: (versionId: number) => request<DraftResponse>(`/api/admin/content/restore/${versionId}`, {
      method: 'POST',
    }),
    importContent: (snapshot: PortfolioSnapshotV1, expectedDraftVersion: number) =>
      request<DraftResponse>('/api/admin/content/import', {
        method: 'POST', body: JSON.stringify({ snapshot, expectedDraftVersion }),
      }),
    exportContent: () => request<DraftResponse>('/api/admin/content/export'),
    uploadMedia: (file: File) => {
      const form = new FormData();
      form.append('file', file);
      return request<Record<string, unknown>>('/api/admin/media', { method: 'POST', body: form });
    },
    deleteMedia: (id: string) => request<void>(`/api/admin/media/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    changePassword: (currentPassword: string, newPassword: string) => request<void>('/api/auth/password', {
      method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }),
    }),
  };
};

export const apiClient = createApiClient();
