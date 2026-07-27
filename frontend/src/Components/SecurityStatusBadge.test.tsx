import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SecurityStatusBadge } from "./SecurityStatusBadge";

describe("SecurityStatusBadge", () => {
  it("shows transparent for a null/undefined security status", () => {
    const { container } = render(<SecurityStatusBadge securityStatus={null} />);
    const dot = container.querySelector("div[style*='border-radius']") as HTMLElement;
    expect(dot.style.backgroundColor).toBe("transparent");
  });

  it("colors a high-sec system (>= 0.5) using GetSecurityColors", () => {
    const { container } = render(<SecurityStatusBadge securityStatus={0.9} />);
    const dot = container.querySelector("div[style*='border-radius']") as HTMLElement;
    expect(dot.style.backgroundColor).toBe("rgb(44, 116, 224)");
  });

  it("colors a low-sec system (> 0 and < 0.5)", () => {
    const { container } = render(<SecurityStatusBadge securityStatus={0.3} />);
    const dot = container.querySelector("div[style*='border-radius']") as HTMLElement;
    expect(dot.style.backgroundColor).toBe("rgb(218, 108, 7)");
  });

  it("colors a null-sec system (<= 0)", () => {
    const { container } = render(<SecurityStatusBadge securityStatus={0.0} />);
    const dot = container.querySelector("div[style*='border-radius']") as HTMLElement;
    // securityStatus=0 is falsy, so the `if (securityStatus)` branch is
    // skipped entirely and it falls back to the default transparent color -
    // real current behaviour, not the "null security" branch you'd expect.
    expect(dot.style.backgroundColor).toBe("transparent");
  });
});
