import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TimeTill } from "./TimeTill";

describe("TimeTill", () => {
  it("renders a relative time plus an absolute UTC caption for a valid date", () => {
    const date = new Date(Date.now() - 60_000).toISOString();
    const { container } = render(<TimeTill date={date} />);

    expect(container.querySelector(".figure-caption")).toBeInTheDocument();
    expect(container.textContent).not.toBe("");
  });

  // isValidDate's own check (`Object.prototype.toString.call(d) ===
  // "[object Date]"`) is true for *any* Date instance, including one built
  // from an unparseable string (`new Date("not a date")` is still a Date,
  // just one whose internal time value is NaN) - so the "invalid" branch
  // that renders nothing is effectively unreachable, and the component goes
  // on to hand a NaN time value to react-time-ago, which throws. This pins
  // down the actual current (buggy) behaviour rather than the intended one.
  it("throws when given an unparseable date string, since isValidDate never actually rejects one", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TimeTill date="not a real date" />)).toThrow();

    consoleError.mockRestore();
  });
});
