import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkillLevelBlock } from "./SkillLevelBlock";

const countIcons = (container: HTMLElement, selector: string) =>
  container.querySelectorAll(selector).length;

describe("SkillLevelBlock", () => {
  it("renders 5 empty circles when nothing is trained", () => {
    const { container } = render(<SkillLevelBlock level={0} />);

    expect(countIcons(container, ".fas.fa-circle")).toBe(0);
    expect(countIcons(container, ".far.fa-circle")).toBe(5);
  });

  it("renders solid circles for active levels and empty ones for the remainder", () => {
    const { container } = render(<SkillLevelBlock level={3} active={3} trained={3} />);

    expect(countIcons(container, ".fas.fa-circle")).toBe(3);
    expect(countIcons(container, ".far.fa-circle")).toBe(2);
  });

  it("shows grey circles for the trained-but-inactive gap between active and trained", () => {
    // active=2, trained=4 -> 2 active, 2 trained-but-inactive (grey), 1 remaining empty
    const { container } = render(<SkillLevelBlock level={4} active={2} trained={4} />);

    const greySolid = Array.from(container.querySelectorAll(".fas.fa-circle")).filter(
      (el) => (el as HTMLElement).style.color === "grey",
    );
    expect(greySolid).toHaveLength(2);
  });

  it("shows orange circles for the missing level between trained and the target level", () => {
    // level=5, active=2, trained=2 -> 2 active, 0 trained-inactive, 3 orange "missing", 0 remaining
    const { container } = render(<SkillLevelBlock level={5} active={2} trained={2} />);

    const orangeSolid = Array.from(container.querySelectorAll(".fas.fa-circle")).filter(
      (el) => (el as HTMLElement).style.color === "orange",
    );
    expect(orangeSolid).toHaveLength(3);
  });
});
