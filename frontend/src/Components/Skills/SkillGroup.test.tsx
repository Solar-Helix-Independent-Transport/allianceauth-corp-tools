import { render, screen } from "@testing-library/react";
import { Accordion } from "react-bootstrap";
import { describe, expect, it } from "vitest";
import { SkillGroup } from "./SkillGroup";

const skills = [
  { group: "Science", skill: "Zoology", level: 1, active: 1, sp: 100 },
  { group: "Science", skill: "Astrometrics", level: 2, active: 2, sp: 200 },
];

describe("SkillGroup", () => {
  it("sums each skill's sp into the group's total SP badge", () => {
    render(
      <Accordion>
        <SkillGroup group="Science" skills={skills} />
      </Accordion>,
    );

    expect(screen.getByText("Science")).toBeInTheDocument();
    expect(screen.getByText("300 Filtered SP")).toBeInTheDocument();
  });

  it("sorts skills alphabetically by name regardless of input order", () => {
    render(
      <Accordion>
        <SkillGroup group="Science" skills={skills} />
      </Accordion>,
    );

    const skillNames = screen.getAllByText(/Zoology|Astrometrics/).map((el) => el.textContent);
    expect(skillNames).toEqual(["Astrometrics", "Zoology"]);
  });

  it("shows the alpha-restricted gap as bootstrap-success, not danger - level is trained_skill_level, not a doctrine target", () => {
    // active=3, level(=trained_skill_level)=5 -> 2 levels trained but not
    // usable on Alpha. That's "Omega Restricted" (success), never "Missing"
    // (danger) - a plain skill list has no target level to be short of.
    const restricted = [{ group: "Science", skill: "Zoology", level: 5, active: 3, sp: 100 }];

    const { container } = render(
      <Accordion>
        <SkillGroup group="Science" skills={restricted} />
      </Accordion>,
    );

    expect(container.querySelectorAll(".fas.fa-circle.text-success")).toHaveLength(2);
    expect(container.querySelectorAll(".fas.fa-circle.text-danger")).toHaveLength(0);
  });

  it("shows queued levels beyond what's currently trained as bootstrap-warning, with no danger dots", () => {
    // trained to level 2, queued up to level 4 - the bar has to stretch
    // past `level` to fit the queued dots, or there's nowhere for them to go.
    const queued = [
      { group: "Science", skill: "Zoology", level: 2, active: 2, sp: 100, queued: 4 },
    ];

    const { container } = render(
      <Accordion>
        <SkillGroup group="Science" skills={queued} />
      </Accordion>,
    );

    expect(container.querySelectorAll(".fas.fa-circle.text-warning")).toHaveLength(2);
    expect(container.querySelectorAll(".fas.fa-circle.text-danger")).toHaveLength(0);
  });
});
