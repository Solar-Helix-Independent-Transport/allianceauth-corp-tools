import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CharMenu from "./CharMenu";

const renderMenu = (data: any) =>
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
});
