/**
 * Panels, modals and menus show their own error state, opting out of the
 * app's default of throwing failed queries to the page's error boundary -
 * otherwise one failing part would replace the whole page (or, for the
 * menus, which sit outside the page boundary, the whole app). Whole pages
 * let the error through to the boundary.
 */
import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../../api/Api";
import * as characterApi from "../../api/character";
import * as corporationApi from "../../api/corporation";
import { createQueryClient } from "../../queryClient";
import PageErrorBoundary from "./PageErrorBoundary";
import { CharMenuAsync } from "../CharacterMenu/CharacterMenuAsync";
import { CorpMenuAsync } from "../CorporationMenu/CorpMenuAsync";
import { SkillsRadarGraph } from "../Graphs/SkillGroups";
import MailModal from "../Mail/MailModal";
import CharacterSkills from "../../Pages/Char/Skills";
import CharacterSkillQueues from "../../Pages/Char/SkillQueue";

vi.mock("../../api/character", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../api/character")>()),
  getCharacterSkills: vi.fn(),
  getCharacterSkillQueues: vi.fn(),
  getCharacterSkillGraph: vi.fn(),
  getMailBody: vi.fn(),
  loadCharacterStatus: vi.fn(),
  getCharacterMenu: vi.fn(),
}));

vi.mock("../../api/corporation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../api/corporation")>()),
  getCorporationMenu: vi.fn(),
}));

const http500 = () => new ApiError(new Response(null, { status: 500 }), undefined);

/** The app's real query client, minus retries so failures land at once. */
const testClient = () => {
  const client = createQueryClient();
  client.setDefaultOptions({ queries: { ...client.getDefaultOptions().queries, retry: false } });
  return client;
};

const renderInPage = (ui: React.ReactNode) =>
  render(
    <QueryClientProvider client={testClient()}>
      <MemoryRouter initialEntries={["/123"]}>
        <PageErrorBoundary>
          <Routes>
            <Route
              path="/:characterID"
              element={
                <>
                  <div>rest of the page</div>
                  {ui}
                </>
              }
            />
          </Routes>
        </PageErrorBoundary>
      </MemoryRouter>
    </QueryClientProvider>,
  );

// every error boundary screen has this button
const expectNoBoundary = () => {
  expect(screen.queryByRole("button", { name: "Try again" })).not.toBeInTheDocument();
  expect(screen.getByText("rest of the page")).toBeInTheDocument();
};

const api = vi.mocked(characterApi);

describe("where query errors are handled", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    // everything else a page asks for succeeds
    api.getCharacterSkillQueues.mockResolvedValue({} as never);
    api.loadCharacterStatus.mockResolvedValue({} as never);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ["character menu", <CharMenuAsync />, () => vi.mocked(characterApi.getCharacterMenu)],
    ["corporation menu", <CorpMenuAsync />, () => vi.mocked(corporationApi.getCorporationMenu)],
  ])("a failing %s leaves the page alone", async (_name, menu, getMenu) => {
    const get = getMenu().mockRejectedValue(http500());
    renderInPage(menu);

    await vi.waitFor(() => expect(get).toHaveBeenCalled());
    await new Promise((r) => setTimeout(r, 50)); // let the failure render
    expectNoBoundary();
  });

  it("mail modal shows its own error", async () => {
    api.getMailBody.mockRejectedValue(http500());
    renderInPage(
      <MailModal
        shown={true}
        setShown={() => {}}
        msg_data={{
          character: "c",
          character_id: 1,
          mail_id: 2,
          from: "f",
          labels: [],
          recipients: [],
          timestamp: "2026-01-01T00:00:00Z",
          subject: "s",
        }}
      />,
    );
    expect(await screen.findByText("Error from API")).toBeInTheDocument();
    expectNoBoundary();
  });

  it("skill graph shows its own error", async () => {
    api.getCharacterSkillGraph.mockRejectedValue(http500());
    renderInPage(<SkillsRadarGraph characterID={123} />);
    expect(await screen.findByText("Error loading data")).toBeInTheDocument();
    expectNoBoundary();
  });

  // Whole pages don't handle their own errors - the page's error boundary
  // shows the status, the server's message and a "Try again".
  it.each([
    ["skills", () => api.getCharacterSkills, <CharacterSkills />],
    ["skill queue", () => api.getCharacterSkillQueues, <CharacterSkillQueues />],
  ])("a failing %s page goes to the page's error boundary", async (_name, fn, page) => {
    fn().mockRejectedValue(http500());
    renderInPage(page);
    expect(await screen.findByText("Error 500")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });
});
