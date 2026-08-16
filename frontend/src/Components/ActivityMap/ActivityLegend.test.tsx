import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ActivityLegend from "./ActivityLegend";

describe("ActivityLegend", () => {
  it("renders nothing when there's no data to scale (maxValue <= 0)", () => {
    const { container } = render(<ActivityLegend maxValue={0} title="ISK Earned" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the abbreviated max value, a fixed 0 floor, and the metric title", () => {
    render(<ActivityLegend maxValue={161_724_215} title="ISK Earned" />);

    expect(screen.getByText("162m")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("ISK Earned")).toBeInTheDocument();
  });
});
