import { ApiError } from "../../api/Api";

/** The HTTP status of a failed API request, or undefined for anything that
 * isn't a request failure. Network errors (no response) count as status 0. */
export const getHttpStatus = (error: unknown): number | undefined => {
  if (error instanceof ApiError) return error.status;
  return undefined;
};
