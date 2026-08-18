export type ApiErrorCode =
  | 'ABORTED'
  | 'FORBIDDEN'
  | 'NETWORK'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'UNAVAILABLE'
  | 'UNEXPECTED'
  | 'VALIDATION'

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    public readonly status: number | null,
  ) {
    super(code)
    this.name = 'ApiError'
  }
}

export function apiErrorFromStatus(status: number): ApiError {
  if (status === 401) return new ApiError('UNAUTHORIZED', status)
  if (status === 403) return new ApiError('FORBIDDEN', status)
  if (status === 404) return new ApiError('NOT_FOUND', status)
  if (status === 400 || status === 409 || status === 422) return new ApiError('VALIDATION', status)
  if (status === 408 || status === 429 || status >= 500) return new ApiError('UNAVAILABLE', status)
  return new ApiError('UNEXPECTED', status)
}
