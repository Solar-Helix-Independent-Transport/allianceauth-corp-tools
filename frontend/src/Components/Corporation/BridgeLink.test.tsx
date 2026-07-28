import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BridgeLink } from "./BridgeLink";

describe("BridgeLink", () => {
  it("renders both ends' system names, ozone and fuel badges when both gates are known", () => {
    const start = {
      system_name: "Jita",
      name: "Jump Bridge Alpha",
      active: true,
      ozone: 3_000_000,
      expires: 20,
      known: true,
    };
    const end = {
      system_name: "Amarr",
      name: "Jump Bridge Beta",
      active: true,
      ozone: 1_000_000,
      expires: 5,
      known: true,
    };

    render(<BridgeLink start={start} end={end} />);

    expect(screen.getByText("Jita")).toBeInTheDocument();
    expect(screen.getByText("Amarr")).toBeInTheDocument();
    expect(screen.getByText("Ozone: 3,000,000")).toBeInTheDocument();
    expect(screen.getByText("Ozone: 1,000,000")).toBeInTheDocument();
    expect(screen.getByText("Fuel: 20 days")).toBeInTheDocument();
    expect(screen.getByText("Fuel: 5 Days")).toBeInTheDocument();
  });

  it("shows an 'Unknown' start gate and a question mark when the end system isn't known", () => {
    const start = { system_name: "", known: false, active: false, ozone: 0, expires: 0 };
    const end = { known: false, active: false, ozone: 0, expires: 0 };

    const { container } = render(<BridgeLink start={start} end={end} />);

    expect(screen.getAllByText("Unknown")).toHaveLength(2);
    expect(container.querySelectorAll(".fa-question-circle").length).toBeGreaterThan(0);
  });

  it("shows an offline indicator for an inactive but known start gate", () => {
    const start = {
      system_name: "Jita",
      name: "Bridge",
      active: false,
      ozone: 100,
      expires: 1,
      known: true,
    };
    const end = { known: false, active: false, ozone: 0, expires: 0 };

    const { container } = render(<BridgeLink start={start} end={end} />);

    expect(container.querySelector(".fa-times-circle")).toBeInTheDocument();
    // low ozone/fuel below the thresholds render as danger badges.
    expect(screen.getByText("Ozone: 100")).toHaveClass("bg-danger");
    expect(screen.getByText("Fuel: 1 days")).toHaveClass("bg-danger");
  });
});
