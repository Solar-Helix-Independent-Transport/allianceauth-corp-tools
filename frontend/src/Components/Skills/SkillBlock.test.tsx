import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkillBlock } from "./SkillBlock";

describe("SkillBlock", () => {
  it("renders the skill name and an SP badge when sp is given", () => {
    render(<SkillBlock skill="Gunnery" level={5} active={5} trained={5} sp={1234567} />);

    expect(screen.getByText("Gunnery")).toBeInTheDocument();
    expect(screen.getByText("1,234,567 SP")).toBeInTheDocument();
  });

  it("omits the SP badge when sp is 0", () => {
    render(<SkillBlock skill="Gunnery" level={1} active={1} trained={1} />);

    expect(screen.queryByText(/SP$/)).not.toBeInTheDocument();
  });
});
