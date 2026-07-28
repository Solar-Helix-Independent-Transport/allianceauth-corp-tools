import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DoctrineCheck } from "./DoctrineCheck";
import { DoctrineSkillReqs } from "./DoctrineTypes";

vi.mock("./DoctrineModal", () => ({
  DoctrineModal: () => <div data-testid="doctrine-modal" />,
}));

describe("DoctrineCheck", () => {
  it("renders nothing when skill_reqs has no _meta", () => {
    // The backend's schema for this data is loosely typed, so a real
    // response missing `_meta` is possible at runtime even though the
    // component's own prop type requires it - hence the cast here.
    const { container } = render(
      <DoctrineCheck
        name="Rifter"
        skill_reqs={{} as unknown as DoctrineSkillReqs}
        skill_list={{}}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows a completion checkmark and no modal when there are no remaining requirements", () => {
    // "completed" means _skill_reqs (skill_reqs minus _meta) is empty - i.e.
    // every requirement has already been stripped out as satisfied.
    const skill_reqs = { _meta: { trained_sp: 100, total_sp: 100 } };

    const { container } = render(
      <DoctrineCheck name="Rifter" skill_reqs={skill_reqs} skill_list={{}} />,
    );

    expect(screen.getByText("Rifter")).toBeInTheDocument();
    expect(container.querySelector(".fa-check")).toBeInTheDocument();
    expect(container.querySelector(".btn-success")).toBeInTheDocument();
    expect(screen.queryByTestId("doctrine-modal")).not.toBeInTheDocument();
  });

  it("shows the warning variant and no copy button when unmet requirements are all alpha-trainable", () => {
    const skill_reqs = {
      _meta: { trained_sp: 50, total_sp: 100 },
      "Small Projectile Turret": 3,
    };
    // trained_level (5) >= required (3) -> alpha_check is true even though
    // completed is false (the requirement is still listed).
    const skill_list = { "Small Projectile Turret": { trained_level: 5, active_level: 5 } };

    const { container } = render(
      <DoctrineCheck name="Rifter" skill_reqs={skill_reqs} skill_list={skill_list} />,
    );

    expect(container.querySelector(".btn-warning")).toBeInTheDocument();
    expect(container.querySelector(".fa-copy")).not.toBeInTheDocument();
    expect(container.querySelector(".fa-circle-exclamation")).toBeInTheDocument();
    expect(screen.getByTestId("doctrine-modal")).toBeInTheDocument();
  });

  it("shows the danger variant, completion percentage, and a copy-to-clipboard button when not even alpha-trainable", () => {
    const skill_reqs = {
      _meta: { trained_sp: 50, total_sp: 100 },
      "Small Projectile Turret": 5,
    };
    const skill_list = { "Small Projectile Turret": { trained_level: 1, active_level: 1 } };

    const { container } = render(
      <DoctrineCheck name="Rifter" skill_reqs={skill_reqs} skill_list={skill_list} />,
    );

    expect(screen.getByText(/50%/)).toBeInTheDocument();
    expect(container.querySelector(".btn-danger")).toBeInTheDocument();
    expect(container.querySelector(".fa-copy")).toBeInTheDocument();
    expect(screen.getByTestId("doctrine-modal")).toBeInTheDocument();
  });
});
