import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsTestingAdapter, type OnUrlUpdateFunction } from "nuqs/adapters/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadStatus } from "../../api/corporation";
import { loadCharacterStatus } from "../../api/character";
import CorpSelect from "./CorporationSelect";

vi.mock("../../api/corporation", () => ({
  loadStatus: vi.fn(),
}));

vi.mock("../../api/character", () => ({
  loadCharacterStatus: vi.fn(),
}));

const renderSelect = (
  searchParams = "",
  onUrlUpdate?: OnUrlUpdateFunction,
  includeAllOption = false,
) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <NuqsTestingAdapter hasMemory searchParams={searchParams} onUrlUpdate={onUrlUpdate}>
        <CorpSelect includeAllOption={includeAllOption} />
      </NuqsTestingAdapter>
    </QueryClientProvider>,
  );
};

const makeStatus = (corps: { corporation_id: number; corporation_name: string }[]) => ({
  corps: corps.map((corporation) => ({ corporation, last_updates: {} })),
  headers: [],
});

describe("CorpSelect", () => {
  beforeEach(() => {
    // No main character/corp by default - individual tests override this
    // when they want to exercise the "main corp first" ordering.
    vi.mocked(loadCharacterStatus).mockResolvedValue({ characters: [] } as never);
  });

  it("shows the corporation matching the ?cid= query param as the selected value", async () => {
    vi.mocked(loadStatus).mockResolvedValue(
      makeStatus([
        { corporation_id: 1, corporation_name: "Alpha Corp" },
        { corporation_id: 2, corporation_name: "Beta Corp" },
      ]),
    );

    renderSelect("?cid=2");

    expect(await screen.findByText("Beta Corp")).toBeInTheDocument();
  });

  it("auto-selects the only corporation when there is just one", async () => {
    vi.mocked(loadStatus).mockResolvedValue(
      makeStatus([{ corporation_id: 7, corporation_name: "Solo Corp" }]),
    );
    const onUrlUpdate = vi.fn();

    renderSelect("", onUrlUpdate);

    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
    const lastUpdate = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
    expect(lastUpdate.searchParams.get("cid")).toBe("7");
  });

  it("does not auto-select when there is more than one corporation", async () => {
    vi.mocked(loadStatus).mockResolvedValue(
      makeStatus([
        { corporation_id: 1, corporation_name: "Alpha Corp" },
        { corporation_id: 2, corporation_name: "Beta Corp" },
      ]),
    );
    const onUrlUpdate = vi.fn();

    renderSelect("", onUrlUpdate);

    await screen.findByText("Select...");
    expect(onUrlUpdate).not.toHaveBeenCalled();
  });

  it("defaults to the All Corporations option when includeAllOption is set", async () => {
    vi.mocked(loadStatus).mockResolvedValue(
      makeStatus([
        { corporation_id: 1, corporation_name: "Alpha Corp" },
        { corporation_id: 2, corporation_name: "Beta Corp" },
      ]),
    );

    renderSelect("", undefined, true);

    expect(await screen.findByText("All Corporations")).toBeInTheDocument();
  });

  it("does not add an All Corporations option when includeAllOption is unset", async () => {
    vi.mocked(loadStatus).mockResolvedValue(
      makeStatus([{ corporation_id: 1, corporation_name: "Alpha Corp" }]),
    );

    renderSelect("", undefined, false);

    await waitFor(() => expect(screen.queryByText("All Corporations")).not.toBeInTheDocument());
  });

  it("lists the main character's corp first, then the rest alphabetically", async () => {
    vi.mocked(loadStatus).mockResolvedValue(
      makeStatus([
        { corporation_id: 3, corporation_name: "Zulu Corp" },
        { corporation_id: 1, corporation_name: "Alpha Corp" },
        { corporation_id: 2, corporation_name: "Beta Corp" },
      ]),
    );
    vi.mocked(loadCharacterStatus).mockResolvedValue({
      characters: [],
      main: { corporation_id: 2, corporation_name: "Beta Corp" },
    } as never);

    renderSelect();
    const input = await screen.findByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });

    const options = await screen.findAllByText(/Corp$/);
    expect(options.map((o) => o.textContent)).toEqual(["Beta Corp", "Alpha Corp", "Zulu Corp"]);
  });
});
