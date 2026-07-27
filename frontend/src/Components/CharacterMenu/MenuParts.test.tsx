import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { MenuDropdown, MenuItem } from "./MenuParts";

const renderAt = (path: string, ui: React.ReactNode) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/audit/r/:characterID/*" element={<ul>{ui}</ul>} />
      </Routes>
    </MemoryRouter>,
  );

describe("MenuItem", () => {
  it("links to the character-scoped route and marks itself active when the path matches", () => {
    renderAt("/audit/r/42/skills", <MenuItem link={{ name: "Skills", link: "skills" }} />);

    const link = screen.getByRole("link", { name: "Skills" });
    expect(link).toHaveAttribute("href", "/audit/r/42/skills");
    expect(link.className).toContain("active");
  });

  it("is not marked active on a different route", () => {
    renderAt("/audit/r/42/wallet", <MenuItem link={{ name: "Skills", link: "skills" }} />);

    const link = screen.getByRole("link", { name: "Skills" });
    expect(link.className).not.toContain("active");
  });
});

describe("MenuDropdown", () => {
  it("renders a dropdown item per link and highlights the category when any child link matches", () => {
    const cat = {
      name: "Assets",
      links: [
        { name: "List", link: "assets/list" },
        { name: "Groups", link: "assets/groups" },
      ],
    };

    renderAt("/audit/r/42/assets/list", <MenuDropdown cat={cat} />);

    const toggle = screen.getByRole("button", { name: "Assets" });
    expect(toggle.className).toContain("active");

    // NavDropdown only mounts its menu items once opened.
    fireEvent.click(toggle);

    expect(screen.getByRole("link", { name: "List" })).toHaveAttribute(
      "href",
      "/audit/r/42/assets/list",
    );
    expect(screen.getByRole("link", { name: "Groups" })).toHaveAttribute(
      "href",
      "/audit/r/42/assets/groups",
    );
  });
});
