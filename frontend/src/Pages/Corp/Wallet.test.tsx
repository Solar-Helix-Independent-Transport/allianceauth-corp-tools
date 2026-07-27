import { act, render, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it, vi } from "vitest";
import CorporationWallets from "./Wallet";

vi.mock("../../Components/Corporation/CorporationSelect", () => ({
  default: () => <div data-testid="corp-select" />,
}));
vi.mock("../../Components/Corporation/Divisions", () => ({
  default: () => <div data-testid="corp-divisions" />,
}));
vi.mock("../../Components/Corporation/WalletTable", () => ({
  default: ({ corporationID, refTypes }: { corporationID: number; refTypes: string }) => (
    <div data-testid="wallet-table">{`${corporationID}:${refTypes}`}</div>
  ),
}));

let lastSetFilter: ((value: string) => void) | null = null;
vi.mock("../../Components/Corporation/RefTypeSelect", () => ({
  default: ({ setFilter }: { setFilter: (value: string) => void }) => {
    lastSetFilter = setFilter;
    return <div data-testid="ref-type-select" />;
  },
}));

const renderPage = (searchParams = "") =>
  render(
    <NuqsTestingAdapter searchParams={searchParams}>
      <CorporationWallets />
    </NuqsTestingAdapter>,
  );

describe("CorporationWallets", () => {
  it("shows the (untitled) CorpLoader when no corporation is selected", () => {
    // <CorpLoader /> here relies on CorpLoader's default parameter for its
    // title, which - like the other Loaders components (see
    // Components/Loaders/loaders.test.tsx) - never actually applies through
    // JSX (`<CorpLoader />` always passes `{}`, not `undefined`), so the
    // heading renders empty rather than "Select Corporation".
    const { container } = renderPage();
    expect(container.querySelector("h3")).toBeEmptyDOMElement();
    expect(screen.queryByTestId("wallet-table")).not.toBeInTheDocument();
  });

  it("shows a 'Select Ref Types' loader once a corporation is selected but no ref type filter is set", () => {
    renderPage("?cid=123");
    expect(screen.getByText("Select Ref Types")).toBeInTheDocument();
    expect(screen.queryByTestId("wallet-table")).not.toBeInTheDocument();
  });

  it("renders the wallet table with the selected corporation and ref types once both are set", () => {
    renderPage("?cid=123");

    act(() => {
      lastSetFilter!("bounty_prizes");
    });

    expect(screen.getByTestId("wallet-table")).toHaveTextContent("123:bounty_prizes");
  });
});
