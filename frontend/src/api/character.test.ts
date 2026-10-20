import { afterEach, describe, expect, it } from "vitest";
import { ApiError } from "./Api";
import { getFitCheck, loadWallet, postAccountRefresh } from "./character";
import { jsonResponse, stubFetch } from "./fetchStub";

describe("character api", () => {
  const { fetchMock, lastRequest } = stubFetch();

  afterEach(() => {
    fetchMock.mockReset();
    document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

  it("sends the fit as raw text, not JSON-encoded", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ skills: [], chars: {} }));
    const fit = "[Rifter, test]\nDamage Control I";

    await getFitCheck(fit, 7);

    const req = lastRequest();
    expect(req.method).toBe("POST");
    expect(new URL(req.url).pathname).toBe("/audit/api/extras/fitting2skills/7");
    expect(req.headers.get("Content-Type")).toBe("text/plain");
    expect(await req.text()).toBe(fit);
  });

  it("posts the account refresh with the character id and csrf token", async () => {
    document.cookie = "csrftoken=abc123";
    fetchMock.mockResolvedValue(jsonResponse({ message: "Requested Update!" }));

    await expect(postAccountRefresh(7)).resolves.toEqual({ message: "Requested Update!" });

    const req = lastRequest();
    expect(req.method).toBe("POST");
    expect(new URL(req.url).pathname).toBe("/audit/api/account/refresh");
    expect(new URL(req.url).searchParams.get("character_id")).toBe("7");
    expect(req.headers.get("x-csrftoken")).toBe("abc123");
  });

  it("returns just the items from the paged wallet", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ items: [{ id: 1 }], count: 1 }));

    await expect(loadWallet(7)).resolves.toEqual([{ id: 1 }]);
  });

  it("throws an ApiError carrying the status on failure", async () => {
    fetchMock.mockResolvedValue(jsonResponse("Permission Denied", 403));

    const error = await loadWallet(7).catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(403);
  });

  it("throws on a failed response with an empty body", async () => {
    fetchMock.mockResolvedValue(
      new Response(null, { status: 500, headers: { "Content-Length": "0" } }),
    );

    const error = await loadWallet(7).catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(500);
  });

  it("throws a status 0 ApiError when the request never gets a response", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    const error = await loadWallet(7).catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(0);
  });

  it("lets an aborted request through unchanged", async () => {
    const abort = new DOMException("The operation was aborted.", "AbortError");
    fetchMock.mockRejectedValue(abort);

    await expect(loadWallet(7)).rejects.toBe(abort);
  });
});
