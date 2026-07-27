import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CorpAddToken from "./CorpAddToken";

describe("CorpAddToken", () => {
  it("defaults Structures and Starbases checked, and everything else unchecked", () => {
    render(<CorpAddToken />);
    fireEvent.click(screen.getByRole("button", { name: "Add Token" }));

    expect(screen.getByLabelText("Structures")).toBeChecked();
    expect(screen.getByLabelText("Starbases")).toBeChecked();
    expect(screen.getByLabelText("Assets")).not.toBeChecked();
    expect(screen.getByLabelText("Moons")).not.toBeChecked();
    expect(screen.getByLabelText("Wallets")).not.toBeChecked();
    expect(screen.getByLabelText("Member Tracking")).not.toBeChecked();
    expect(screen.getByLabelText("Contracts")).not.toBeChecked();
    expect(screen.getByLabelText("Industry Jobs")).not.toBeChecked();
    expect(screen.getByLabelText("Sov Structures")).not.toBeChecked();
  });

  it("submits to the add_options endpoint via GET", () => {
    const { container } = render(<CorpAddToken />);
    fireEvent.click(screen.getByRole("button", { name: "Add Token" }));

    const form = container.querySelector("form") as HTMLFormElement;
    expect(form).toHaveAttribute("action", "/audit/corp/add_options");
    expect(form).toHaveAttribute("method", "get");
  });
});
