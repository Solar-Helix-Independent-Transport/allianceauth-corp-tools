import { afterEach, describe, expect, it } from "vitest";
import { loadAssetList, loadStatus, loadStructureFit, loadWallet } from "./corporation";
import { jsonResponse, stubFetch } from "./fetchStub";

describe("corporation api", () => {
  const { fetchMock, lastUrl } = stubFetch();

  afterEach(() => {
    fetchMock.mockReset();
  });

  it("sends the wallet ref type filter and page as query params", async () => {
    fetchMock.mockResolvedValue(jsonResponse([]));

    await loadWallet(7, "bounty_prizes", 3);

    expect(lastUrl().pathname).toBe("/audit/api/corporation/7/wallet");
    expect(lastUrl().searchParams.get("type_refs")).toBe("bounty_prizes");
    expect(lastUrl().searchParams.get("page")).toBe("3");
  });

  it("sends the asset tree flag as a query param", async () => {
    fetchMock.mockResolvedValue(jsonResponse([]));

    await loadAssetList(7, 60003760, true);

    expect(lastUrl().pathname).toBe("/audit/api/corporation/7/asset/60003760/list");
    expect(lastUrl().searchParams.get("new_asset_tree")).toBe("true");
  });

  it("puts the structure id in the path", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ fit: {} }));

    await loadStructureFit(1035466617946);

    expect(lastUrl().pathname).toBe("/audit/api/corp/structures/1035466617946");
  });

  it("collects the sorted update headers across corps", async () => {
    const corp = (id: number, updates: string[]) => ({
      corporation: { corporation_id: id, corporation_name: `Corp ${id}` },
      characters: 1,
      active: true,
      last_updates: Object.fromEntries(updates.map((u) => [u, { update: null, change: null }])),
    });
    fetchMock.mockResolvedValue(
      jsonResponse([corp(1, ["wallets", "assets"]), corp(2, ["assets", "structures"])]),
    );

    const status = await loadStatus();

    expect(status.corps).toHaveLength(2);
    expect(status.headers).toEqual(["assets", "structures", "wallets"]);
  });
});
