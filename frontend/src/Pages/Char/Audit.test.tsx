import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import CharacterAudit from "./Audit";

vi.mock("../../Components/CharacterMenu/CharacterMenuAsync", () => ({
  CharMenuAsync: () => <div data-testid="char-menu-async" />,
}));
vi.mock("../../Components/CharacterMenu/CharacterMenuRight", () => ({
  CharMenuRight: () => <div data-testid="char-menu-right" />,
}));
vi.mock("../../Components/Character/CharacterHeader", () => ({
  CharHeader: () => <div data-testid="char-header" />,
}));

const Bomb = () => {
  throw new Error("kaboom");
};

const renderAudit = (child: React.ReactNode) =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<CharacterAudit />}>
          <Route index element={child} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe("CharacterAudit", () => {
  it("renders the character menu chrome and the routed child content", () => {
    renderAudit(<div>Child Page Content</div>);

    expect(screen.getByTestId("char-menu-async")).toBeInTheDocument();
    expect(screen.getByTestId("char-menu-right")).toBeInTheDocument();
    expect(screen.getByTestId("char-header")).toBeInTheDocument();
    expect(screen.getByText("Child Page Content")).toBeInTheDocument();
  });

  it("contains a routed child's render error in its ErrorBoundary without taking down the menu chrome", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    renderAudit(<Bomb />);

    expect(screen.getByTestId("char-menu-async")).toBeInTheDocument();
    expect(screen.getByText("kaboom")).toBeInTheDocument();

    consoleError.mockRestore();
  });
});
