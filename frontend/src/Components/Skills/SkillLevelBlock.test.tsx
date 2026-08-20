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

  it("shows bootstrap-success circles for the trained-but-inactive (omega restricted) gap between active and trained", () => {
    // active=2, trained=4 -> 2 active, 2 trained-but-inactive (success), 1 remaining empty
    const { container } = render(<SkillLevelBlock level={4} active={2} trained={4} />);

    expect(countIcons(container, ".fas.fa-circle.text-success")).toBe(2);
  });

  it("shows bootstrap-danger circles for a missing level with nothing queued", () => {
    // level=5, active=2, trained=2, queued=0 -> 2 active, 0 trained-inactive, 3 danger "missing", 0 remaining
    const { container } = render(<SkillLevelBlock level={5} active={2} trained={2} />);

    expect(countIcons(container, ".fas.fa-circle.text-danger")).toBe(3);
  });

  it("shows bootstrap-warning circles for the portion of the gap already in the skill queue", () => {
    // level=5, active=2, trained=2, queued=4 -> gap of 3 (2->5), 2 of it (2->4) covered
    // by the queue (warning), 1 still missing (danger)
    const { container } = render(<SkillLevelBlock level={5} active={2} trained={2} queued={4} />);

    expect(countIcons(container, ".fas.fa-circle.text-warning")).toBe(2);
    expect(countIcons(container, ".fas.fa-circle.text-danger")).toBe(1);
  });

  it("shows the whole gap as bootstrap-warning when queued is set to the target level", () => {
    // The skill queue page's own usage: queued === level, so nothing reads as missing.
    const { container } = render(<SkillLevelBlock level={5} active={2} trained={2} queued={5} />);

    expect(countIcons(container, ".fas.fa-circle.text-warning")).toBe(3);
    expect(countIcons(container, ".fas.fa-circle.text-danger")).toBe(0);
  });
});
