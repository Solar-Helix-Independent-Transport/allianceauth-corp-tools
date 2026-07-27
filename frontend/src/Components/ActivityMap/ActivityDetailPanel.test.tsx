import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ActivityDetailPanel from "./ActivityDetailPanel";
import type { ActivityMapSystem } from "./types";

const makeSystem = (overrides: Partial<ActivityMapSystem> = {}): ActivityMapSystem => ({
  id: 1,
  name: "Jita",
  region_id: 1,
  constellation_id: 1,
  x_2d: 0,
  y_2d: 0,
  x_real: 0,
  y_real: 0,
  security_status: 0.9,
  security_class: "A",
  external: false,
  ...overrides,
});

describe("ActivityDetailPanel", () => {
  it("shows the system name and its security status/class", () => {
    render(
      <ActivityDetailPanel
        system={makeSystem({ name: "Jita", security_status: 0.9, security_class: "A" })}
        value={0}
        count={0}
        quantity={0}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText("Jita")).toBeInTheDocument();
    expect(screen.getByText("0.9 (A)")).toBeInTheDocument();
  });

  it("renders a dash for unknown security status", () => {
    render(
      <ActivityDetailPanel
        system={makeSystem({ security_status: null, security_class: null })}
        value={0}
        count={0}
        quantity={0}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("only renders rows for the labels that were provided", () => {
    render(
      <ActivityDetailPanel
        system={makeSystem()}
        value={123}
        count={45}
        quantity={6}
        countLabel="Assets"
        onClose={() => {}}
      />,
    );

    expect(screen.getByText("Assets")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    // valueLabel/quantityLabel were omitted, so neither number should render.
    expect(screen.queryByText("123")).not.toBeInTheDocument();
    expect(screen.queryByText("6")).not.toBeInTheDocument();
  });

  it("renders every row when all three labels are provided", () => {
    render(
      <ActivityDetailPanel
        system={makeSystem()}
        value={1000}
        count={45}
        quantity={6}
        valueLabel="ISK Earned"
        countLabel="Payouts"
        quantityLabel="Units"
        onClose={() => {}}
      />,
    );

    expect(screen.getByText("ISK Earned")).toBeInTheDocument();
    expect(screen.getByText("1,000")).toBeInTheDocument();
    expect(screen.getByText("Payouts")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("Units")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <ActivityDetailPanel
        system={makeSystem()}
        value={0}
        count={0}
        quantity={0}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
