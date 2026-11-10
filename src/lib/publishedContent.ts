import { ApiError } from './apiClient.js';

export type PublishedContentResult<Snapshot> =
  | { status: 'ready'; snapshot: Snapshot }
  | { status: 'unpublished' | 'unavailable'; snapshot: null };

export const loadPublishedContent = async <Snapshot>(
  fetchCurrent: () => Promise<{ snapshot: Snapshot }>,
): Promise<PublishedContentResult<Snapshot>> => {
  try {
    const current = await fetchCurrent();
    return { status: 'ready', snapshot: current.snapshot };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404 && error.code === 'CONTENT_NOT_FOUND') {
      return { status: 'unpublished', snapshot: null };
    }
    return { status: 'unavailable', snapshot: null };
  }
};
