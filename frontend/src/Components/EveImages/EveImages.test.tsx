import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  AllianceLogo,
  CharacterAllegiancePortrait,
  CharacterPortrait,
  CorporationLogo,
  TypeIcon,
} from "./EveImages";

describe("CharacterPortrait", () => {
  it("builds the images.evetech.net portrait URL from character_id and size", () => {
    const { container } = render(<CharacterPortrait character_id={123} size={128} />);
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://images.evetech.net/characters/123/portrait?size=128",
    );
  });
});

describe("CorporationLogo", () => {
  it("builds the images.evetech.net logo URL from corporation_id and size", () => {
    const { container } = render(<CorporationLogo corporation_id={456} size={64} />);
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://images.evetech.net/corporations/456/logo?size=64",
    );
  });
});

describe("AllianceLogo", () => {
  it("builds the images.evetech.net logo URL from alliance_id and size", () => {
    const { container } = render(<AllianceLogo alliance_id={789} size={64} />);
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://images.evetech.net/alliances/789/logo?size=64",
    );
  });
});

describe("TypeIcon", () => {
  it("uses the icon render for sizes at or below 64", () => {
    const { container } = render(<TypeIcon type_id={587} size={64} />);
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://images.evetech.net/types/587/icon?size=64",
    );
  });

  it("uses the render endpoint for sizes above 64", () => {
    const { container } = render(<TypeIcon type_id={587} size={128} />);
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://images.evetech.net/types/587/render?size=128",
    );
  });

  it("uses forceType when given, regardless of size", () => {
    const { container } = render(<TypeIcon type_id={587} size={128} forceType="icon" />);
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://images.evetech.net/types/587/icon?size=128",
    );
  });
});

describe("CharacterAllegiancePortrait", () => {
  const baseCharacter = { character_id: 1, corporation_id: 2 };

  it("renders the character portrait plus a corp logo badge", () => {
    const { container } = render(
      <CharacterAllegiancePortrait character={baseCharacter} size={256} />,
    );

    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute(
      "src",
      "https://images.evetech.net/characters/1/portrait?size=512",
    );
    expect(images[1]).toHaveAttribute(
      "src",
      "https://images.evetech.net/corporations/2/logo?size=256",
    );
  });

  it("renders a faction logo badge instead of the alliance logo when faction_id is set", () => {
    const { container } = render(
      <CharacterAllegiancePortrait
        character={{ ...baseCharacter, alliance_id: 3, faction_id: 4 }}
        size={256}
      />,
    );

    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(3);
    // The faction badge reuses CorporationLogo pointed at faction_id, since
    // EVE serves faction insignia from the corporation logo endpoint.
    expect(images[2]).toHaveAttribute(
      "src",
      "https://images.evetech.net/corporations/4/logo?size=256",
    );
  });

  it("renders an alliance logo badge when there is an alliance but no faction", () => {
    const { container } = render(
      <CharacterAllegiancePortrait character={{ ...baseCharacter, alliance_id: 3 }} size={256} />,
    );

    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(3);
    expect(images[2]).toHaveAttribute(
      "src",
      "https://images.evetech.net/alliances/3/logo?size=256",
    );
  });

  it("applies a circular border style to every image when rounded_images is set", () => {
    const { container } = render(
      <CharacterAllegiancePortrait character={baseCharacter} size={256} rounded_images />,
    );

    container.querySelectorAll("img").forEach((img) => {
      expect((img as HTMLElement).style.borderRadius).toBe("50%");
    });
  });
});
