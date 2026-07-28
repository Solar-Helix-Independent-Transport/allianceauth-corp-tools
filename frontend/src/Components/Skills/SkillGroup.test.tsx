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
});
