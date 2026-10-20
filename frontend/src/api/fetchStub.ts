import { vi } from "vitest";

// Node's Request won't take the client's relative URLs the way a browser
// does, so resolve them against the page like the browser would.
class PageRequest extends Request {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(typeof input === "string" ? new URL(input, window.location.origin) : input, init);
  }
}

/** Stub fetch for the typed client. getCatApi builds a fresh client per
 * call, so it picks up these stubs. Call at the top of a describe block. */
export const stubFetch = () => {
  const fetchMock = vi.fn<typeof fetch>();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("Request", PageRequest);

  // openapi-fetch hands fetch a Request object
  const lastRequest = () => fetchMock.mock.lastCall![0] as Request;
  const lastUrl = () => new URL(lastRequest().url);

  return { fetchMock, lastRequest, lastUrl };
};

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
