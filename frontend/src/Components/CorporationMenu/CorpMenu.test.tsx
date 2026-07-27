import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CorpMenu from "./CorpMenu";

const renderMenu = () =>
  render(
    <MemoryRouter initialEntries={["/audit/r/corp/glance"]}>
      <Routes>
        <Route
          path="/audit/r/corp/*"
          element={
            <ul>
              <CorpMenu />
            </ul>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

describe("CorpMenu", () => {
  it("renders a plain link for a top-level entry with no sub-links", () => {
    renderMenu();
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
      "href",
      "/audit/r/corp/glance",
    );
  });

  it("renders a dropdown for a category with sub-links", () => {
    renderMenu();

    fireEvent.click(screen.getByRole("button", { name: "Structures" }));
    expect(screen.getByRole("link", { name: "Pocos" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sovereignty Hubs" })).toBeInTheDocument();
  });

  it("renders an absolute href (not a router link) for dashboard entries starting with '/'", () => {
    renderMenu();

    fireEvent.click(screen.getByRole("button", { name: "Dashboards" }));
    expect(screen.getByRole("link", { name: "Fuel" })).toHaveAttribute(
      "href",
      "/audit/corp/dashboard/fuel",
    );
  });
});
