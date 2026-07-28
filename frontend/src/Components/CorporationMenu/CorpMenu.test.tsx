import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { MenuCategory, MenuLinkItem } from "../Menu/MenuParts";
import CorpMenu from "./CorpMenu";

const renderMenu = (data: Array<MenuCategory | MenuLinkItem>) =>
  render(
    <MemoryRouter initialEntries={["/audit/r/corp/glance"]}>
      <Routes>
        <Route
          path="/audit/r/corp/*"
          element={
            <ul>
              <CorpMenu data={data} isLoading={false} error={false} />
            </ul>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

describe("CorpMenu", () => {
  it("renders a plain link for a top-level entry with no sub-links", () => {
    renderMenu([{ name: "Overview", link: "glance" }]);
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
      "href",
      "/audit/r/corp/glance",
    );
  });

  it("renders a dropdown for a category with sub-links", () => {
    renderMenu([
      {
        name: "Structures",
        links: [
          { name: "Pocos", link: "pocos" },
          { name: "Sovereignty Hubs", link: "sovhubs" },
        ],
      },
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Structures" }));
    expect(screen.getByRole("link", { name: "Pocos" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sovereignty Hubs" })).toBeInTheDocument();
  });

  it("renders an absolute href (not a router link) for dashboard entries starting with '/'", () => {
    renderMenu([
      {
        name: "Dashboards",
        links: [{ name: "Fuel", link: "/audit/corp/dashboard/fuel" }],
      },
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Dashboards" }));
    expect(screen.getByRole("link", { name: "Fuel" })).toHaveAttribute(
      "href",
      "/audit/corp/dashboard/fuel",
    );
  });

  it("renders nothing extra for an empty menu", () => {
    const { container } = renderMenu([]);
    expect(container.querySelectorAll("li").length).toBe(0);
  });
});
