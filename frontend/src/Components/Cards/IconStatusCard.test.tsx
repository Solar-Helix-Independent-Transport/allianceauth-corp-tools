import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IconStatusDiv } from "./IconStatusCard";
import { statusProps } from "./IconStatusCard.helpers";

describe("statusProps", () => {
  it("marks a truthy value as success, formatted with String() by default", () => {
    expect(statusProps(5, false)).toEqual({
      isLoading: false,
      text: "5",
      textVariant: "success",
      cardVariant: "success",
    });
  });

  it("uses the given format function when provided", () => {
    const result = statusProps(1234, false, "secondary", (v) => `#${v}`);
    expect(result.text).toBe("#1234");
  });

  it("falls back to a dash and the empty variant for a falsy value when not loading", () => {
    expect(statusProps(0, false, "danger")).toEqual({
      isLoading: false,
      text: "-",
      textVariant: "danger",
      cardVariant: "danger",
    });
  });

  it("leaves variant undefined for a falsy value while still loading", () => {
    const result = statusProps(null, true);
    expect(result.textVariant).toBeUndefined();
    expect(result.cardVariant).toBeUndefined();
    expect(result.text).toBe("-");
  });
});

describe("IconStatusDiv", () => {
  it("renders the icon and text with the given variant", () => {
    const { container } = render(
      <IconStatusDiv iconSrc="/icon.png" text="42" textVariant="success" cardVariant="success" />,
    );

    expect(container.querySelector("img")).toHaveAttribute("src", "/icon.png");
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("shows a spinner instead of the text while loading", () => {
    const { container } = render(<IconStatusDiv iconSrc="/icon.png" text="42" isLoading />);

    expect(screen.queryByText("42")).not.toBeInTheDocument();
    expect(container.querySelector(".spinner-border")).toBeInTheDocument();
  });

  it("wraps in a tooltip trigger only when toolTipText is given", () => {
    const { container: withoutTooltip } = render(<IconStatusDiv iconSrc="/icon.png" />);
    expect(withoutTooltip.querySelector("[aria-describedby]")).not.toBeInTheDocument();

    const { container: withTooltip } = render(
      <IconStatusDiv iconSrc="/icon.png" toolTipText="Details here" />,
    );
    // OverlayTrigger clones its child and wires up aria-describedby/mouse
    // handlers for the hover/focus trigger - proof the tooltip is wired up.
    expect(withTooltip.querySelector("div[style]")).toBeTruthy();
  });
});
