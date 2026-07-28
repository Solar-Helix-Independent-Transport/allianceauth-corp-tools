import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { MenuDropdown, MenuItem } from "./MenuParts";

const renderAt = (path: string, routePath: string, ui: React.ReactNode) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePath} element={<ul>{ui}</ul>} />
      </Routes>
    </MemoryRouter>,
  );

const charToPath = (link: string) => `/audit/r/42/${link}`;
const corpToPath = (link: string) => `/audit/r/corp/${link}`;

describe("MenuItem", () => {
  it("builds the link via the supplied toPath and marks itself active when the path matches", () => {
    renderAt(
      "/audit/r/42/skills",
      "/audit/r/:characterID/*",
      <MenuItem link={{ name: "Skills", link: "skills" }} toPath={charToPath} />,
    );

    const link = screen.getByRole("link", { name: "Skills" });
    expect(link).toHaveAttribute("href", "/audit/r/42/skills");
    expect(link.className).toContain("active");
  });

  it("is not marked active on a different route", () => {
    renderAt(
      "/audit/r/42/wallet",
      "/audit/r/:characterID/*",
      <MenuItem link={{ name: "Skills", link: "skills" }} toPath={charToPath} />,
    );

    const link = screen.getByRole("link", { name: "Skills" });
    expect(link.className).not.toContain("active");
  });

  it("works just as well with a fixed-prefix toPath (corp scope)", () => {
    renderAt(
      "/audit/r/corp/wallet",
      "/audit/r/corp/*",
      <MenuItem link={{ name: "Wallet", link: "wallet" }} toPath={corpToPath} />,
    );

    const link = screen.getByRole("link", { name: "Wallet" });
    expect(link).toHaveAttribute("href", "/audit/r/corp/wallet");
    expect(link.className).toContain("active");
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

    renderAt(
      "/audit/r/42/assets/list",
      "/audit/r/:characterID/*",
      <MenuDropdown cat={cat} toPath={charToPath} />,
    );

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

  it("renders a plain href for entries whose link starts with '/', bypassing toPath", () => {
    const cat = {
      name: "External",
      links: [{ name: "Docs", link: "/static/docs.html" }],
    };

    renderAt(
      "/audit/r/corp/wallet",
      "/audit/r/corp/*",
      <MenuDropdown cat={cat} toPath={corpToPath} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "External" }));

    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "/static/docs.html");
  });
});
