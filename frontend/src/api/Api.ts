import type { paths } from "./CtApi";
import Cookies from "js-cookie";
import createClient from "openapi-fetch";
import type { PathsWithMethod } from "openapi-typescript-helpers";

export type GetEndpoint = PathsWithMethod<paths, "get">;

export const getCatApi = () => {
  const csrf = Cookies.get("csrftoken");

  return createClient<paths>({
    baseUrl: "/",
    headers: { "x-csrftoken": csrf ? csrf : "" },
  });
};

/** The data from a typed client call, or an ApiError if it failed. Checks
 * `response.ok` rather than `error`, since openapi-fetch leaves `error`
 * undefined for a failed response with an empty body. */
export async function unwrap<T>(
  request: Promise<{ data?: T; error?: unknown; response: Response }>,
): Promise<T> {
  let result;
  try {
    result = await request;
  } catch (e) {
    // fetch rejects with a TypeError when the request never got a response
    // (offline, DNS, connection reset). Anything else - an abort, a bug -
    // goes through as it is.
    if (e instanceof TypeError) throw new ApiError(undefined, undefined, e.message);
    throw e;
  }
  const { data, error, response } = result;
  if (!response.ok) {
    throw new ApiError(response, error);
  }
  return data as T;
}

/** A failed API call, keeping the HTTP status - openapi-fetch's `error` is
 * just the parsed response body. With no response (a network failure) the
 * status is 0. */
export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(response: Response | undefined, body: unknown, message?: string) {
    const detail =
      body && typeof body === "object" && "detail" in body ? String(body.detail) : undefined;
    const status = response?.status ?? 0;
    super(detail || message || response?.statusText || `HTTP ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}
