export interface ApiError extends Error {
  title?: string;
  errors?: Error;
  status?: number;
}
