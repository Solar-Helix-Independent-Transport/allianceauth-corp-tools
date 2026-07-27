import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BridgeHeader } from "./BridgeHeader";

describe("BridgeHeader", () => {
  it("renders the gate status legend and fuel level badges", () => {
    render(<BridgeHeader />);

    expect(screen.getByText("Gate Online")).toBeInTheDocument();
    expect(screen.getByText("Gate Offline")).toBeInTheDocument();
    expect(screen.getByText("Gate Unknown")).toBeInTheDocument();
    expect(screen.getByText("Lo/Fuel Level Ok")).toBeInTheDocument();
    expect(screen.getByText("Lo/Fuel Level Low")).toBeInTheDocument();
  });
});
