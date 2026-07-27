import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkillBlockKey } from "./SkillBlockKey";

describe("SkillBlockKey", () => {
  it("renders the three legend entries", () => {
    render(<SkillBlockKey />);

    expect(screen.getByText("Trained Level")).toBeInTheDocument();
    expect(screen.getByText("Omega Restricted")).toBeInTheDocument();
    expect(screen.getByText("Missing Level")).toBeInTheDocument();
  });
});
