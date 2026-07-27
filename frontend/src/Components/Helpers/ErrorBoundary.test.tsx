import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ErrorBoundary from "./ErrorBoundary";

const Bomb = () => {
  throw new Error("kaboom");
};

describe("ErrorBoundary", () => {
  it("renders children when nothing throws", () => {
    render(
      <ErrorBoundary>
        <div>all good</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText("all good")).toBeInTheDocument();
  });

  it("catches a render error from a child and shows the fallback UI with the error message", () => {
    // React logs the caught error to the console by default; silence it so
    // this expected-error test doesn't spam the test output.
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );

    expect(screen.getByText("kaboom")).toBeInTheDocument();
    // The fallback's title comes from the caught error's own `.name`
    // ("Error"), not ErrorLoader's unreachable default title (see
    // loaders.test.tsx) - componentDidCatch always passes an explicit title.
    expect(screen.getByText("Error")).toBeInTheDocument();

    consoleError.mockRestore();
  });
});
