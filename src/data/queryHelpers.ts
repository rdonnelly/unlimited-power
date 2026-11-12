export class HttpError extends Error {
  constructor(public readonly status: number) {
    super(`Request failed (${status})`);
    this.name = 'HttpError';
  }
}

export function shouldRetryQuery(failureCount: number, error: Error) {
  if (error.name === 'AbortError' || failureCount >= 2) {
    return false;
  }

  return (
    !(error instanceof HttpError) ||
    error.status === 408 ||
    error.status === 429 ||
    error.status >= 500
  );
}

export const QUERY_STALE_TIME = 60 * 60 * 1000;
export const QUERY_CACHE_TIME = QUERY_STALE_TIME;
