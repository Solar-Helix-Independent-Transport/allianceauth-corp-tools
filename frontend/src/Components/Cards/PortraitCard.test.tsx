import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PortraitCard } from "./PortraitCard";

const character = {
  character_id: 1,
  character_name: "Test Character",
  corporation_id: 2,
  alliance_id: null,
  faction_id: null,
};

describe("PortraitCard", () => {
  it("renders the heading and children", () => {
    render(
      <PortraitCard character={character} heading="Test Character">
        <div>child content</div>
      </PortraitCard>,
    );

    expect(screen.getByText("Test Character")).toBeInTheDocument();
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("renders the header icon when given", () => {
    const { container } = render(
      <PortraitCard character={character} heading="Test" headerIcon="fas fa-star">
        <div />
      </PortraitCard>,
    );

    expect(container.querySelector(".fa-star")).toBeInTheDocument();
  });

  it("shows the refresh spinner icon only while isFetching", () => {
    const { container, rerender } = render(
      <PortraitCard character={character} heading="Test">
        <div />
      </PortraitCard>,
    );
    expect(container.querySelector(".fa-sync-alt")).not.toBeInTheDocument();

    rerender(
      <PortraitCard character={character} heading="Test" isFetching>
        <div />
      </PortraitCard>,
    );
    expect(container.querySelector(".fa-sync-alt")).toBeInTheDocument();
  });

  it("renders the character's portrait image at the requested size", () => {
    const { container } = render(
      <PortraitCard character={character} heading="Test" portaitSize={128}>
        <div />
      </PortraitCard>,
    );

    const portrait = container.querySelector("img.card-img-top");
    expect(portrait).toHaveAttribute(
      "src",
      "https://images.evetech.net/characters/1/portrait?size=512",
    );
  });
});
