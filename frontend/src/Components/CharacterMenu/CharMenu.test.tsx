import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import CharMenu, { CharCategoryProps, CharMenuItemProps } from "./CharMenu";

const renderMenu = (data: Array<CharCategoryProps | CharMenuItemProps>) =>
  render(
    <MemoryRouter initialEntries={["/audit/r/42/account/overview"]}>
      <Routes>
        <Route
          path="/audit/r/:characterID/*"
          element={<ul>{<CharMenu data={data} isLoading={false} error={false} />}</ul>}
        />
      </Routes>
    </MemoryRouter>,
  );

describe("CharMenu", () => {
  it("always renders an Overview link", () => {
    renderMenu([]);
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
      "href",
      "/audit/r/42/account/overview",
    );
  });

  it("renders a dropdown for a category that has sub-links", () => {
    renderMenu([{ name: "Assets", links: [{ name: "List", link: "assets/list" }] }]);

    fireEvent.click(screen.getByRole("button", { name: "Assets" }));
    expect(screen.getByRole("link", { name: "List" })).toBeInTheDocument();
  });

  it("renders a plain external link for a top-level entry whose link starts with '/'", () => {
    renderMenu([{ name: "Docs", link: "/static/docs.html" }]);

    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/static/docs.html");
  });

  it("renders a plain link, not an empty dropdown, when the API sends links: null (e.g. Admin)", () => {
    // MenuCategory always serializes a `links` key (pydantic doesn't drop
    // None fields), so a plain entry like the "Admin" item still arrives as
    // { name, link, links: null } rather than omitting `links` entirely.
    renderMenu([{ name: "Admin", link: "/audit/admin", links: null as unknown as undefined }]);

    expect(screen.getByRole("link", { name: "Admin" })).toHaveAttribute("href", "/audit/admin");
    expect(screen.queryByRole("button", { name: "Admin" })).not.toBeInTheDocument();
  });
});
