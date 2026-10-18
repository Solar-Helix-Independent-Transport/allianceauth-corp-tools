import axios from "axios";
import { ApiError } from "../../api/Api";

/** The HTTP status of a failed request from either API client, or undefined
 * for anything that isn't a request failure. Network errors (no response)
 * count as status 0. */
export const getHttpStatus = (error: unknown): number | undefined => {
  if (error instanceof ApiError) return error.status;
  if (axios.isAxiosError(error)) return error.response?.status ?? 0;
  return undefined;
};
