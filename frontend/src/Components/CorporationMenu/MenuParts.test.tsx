import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { MenuDropdown, MenuItem } from "./MenuParts";

const renderAt = (path: string, ui: React.ReactNode) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/audit/r/corp/*" element={<ul>{ui}</ul>} />
      </Routes>
    </MemoryRouter>,
  );

describe("MenuItem", () => {
  it("links under the fixed corp base URL and marks itself active on a matching path", () => {
    renderAt("/audit/r/corp/wallet", <MenuItem link={{ name: "Wallet", link: "wallet" }} />);

    const link = screen.getByRole("link", { name: "Wallet" });
    expect(link).toHaveAttribute("href", "/audit/r/corp/wallet");
    expect(link.className).toContain("active");
  });
});

describe("MenuDropdown", () => {
  it("renders a plain href link for entries whose link starts with '/'", () => {
    const cat = {
      name: "External",
      links: [{ name: "Docs", link: "/static/docs.html" }],
    };

    renderAt("/audit/r/corp/wallet", <MenuDropdown cat={cat} />);
    fireEvent.click(screen.getByRole("button", { name: "External" }));

    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "/static/docs.html");
  });

  it("renders a router link under the corp base URL for relative entries", () => {
    const cat = {
      name: "Internal",
      links: [{ name: "Wallet", link: "wallet" }],
    };

    renderAt("/audit/r/corp/wallet", <MenuDropdown cat={cat} />);
    fireEvent.click(screen.getByRole("button", { name: "Internal" }));

    const link = screen.getByRole("link", { name: "Wallet" });
    expect(link).toHaveAttribute("href", "/audit/r/corp/wallet");
  });
});
