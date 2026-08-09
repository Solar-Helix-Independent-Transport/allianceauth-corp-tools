import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CharSkillGroups from "./CharacterSkills";

const data = [
  { skill: "Zoology", group: "Science", level: 1, active: 1, sp: 100 },
  { skill: "Small Hybrid Turret", group: "Gunnery", level: 3, active: 3, sp: 300 },
  { skill: "Astrometrics", group: "Science", level: 2, active: 2, sp: 200 },
];

describe("CharSkillGroups", () => {
  it("shows a 'Nothing Found' placeholder when data is empty", () => {
    render(<CharSkillGroups data={[]} />);
    expect(screen.getByText("Nothing Found")).toBeInTheDocument();
  });

  it("doesn't crash when data is undefined at runtime, even though the type says it can't be (#196)", () => {
    // The only current caller (Pages/Char/Skills.tsx) guards with
    // `skill_data ?? []`, but that's the caller's contract, not this
    // component's - a real API response for a character with no skill data
    // yet (e.g. a main with no ESI token added) can still hand this
    // undefined at runtime regardless of what TypeScript assumes. Casting
    // around the type here to reproduce that.
    render(<CharSkillGroups data={undefined as unknown as typeof data} />);
    expect(screen.getByText("Nothing Found")).toBeInTheDocument();
  });

  it("groups skills by their 'group' field and renders one accordion item per group", () => {
    render(<CharSkillGroups data={data} />);

    expect(screen.getByText("Science")).toBeInTheDocument();
    expect(screen.getByText("Gunnery")).toBeInTheDocument();
    expect(screen.getByText("Zoology")).toBeInTheDocument();
    expect(screen.getByText("Astrometrics")).toBeInTheDocument();
    expect(screen.getByText("Small Hybrid Turret")).toBeInTheDocument();
  });

  it("sorts the group headers alphabetically regardless of input order", () => {
    render(<CharSkillGroups data={data} />);

    const headers = screen.getAllByText(/Science|Gunnery/).map((el) => el.textContent);
    expect(headers).toEqual(["Gunnery", "Science"]);
  });
});
