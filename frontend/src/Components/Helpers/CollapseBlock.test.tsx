import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CollapseBlock } from "./CollapseBlock";

describe("CollapseBlock", () => {
  it("starts collapsed and expands when the chevron is clicked", async () => {
    const { container } = render(
      <CollapseBlock heading="Section" id="section-content">
        <div>hidden content</div>
      </CollapseBlock>,
    );

    expect(screen.getByText("Section")).toBeInTheDocument();
    expect(container.querySelector(".fa-chevron-down")).toBeInTheDocument();
    expect(container.querySelector(".collapse.show")).not.toBeInTheDocument();

    fireEvent.click(container.querySelector(".fa-chevron-down")!);

    expect(container.querySelector(".fa-chevron-up")).toBeInTheDocument();
    // react-bootstrap's Collapse only adds the "show" class once its
    // transition completes, which happens on a real timer even in jsdom.
    await waitFor(() => expect(container.querySelector(".collapse.show")).toBeInTheDocument());
    expect(screen.getByText("hidden content")).toBeInTheDocument();
    // Collapse's transitionend fallback timer isn't cancelled by the real
    // event firing, just left to fire (as a no-op) a few ms later - give it
    // a moment so it doesn't fire after this file's jsdom is torn down.
    await new Promise((resolve) => setTimeout(resolve, 20));
  });

  it("collapses again on a second click", async () => {
    const { container } = render(
      <CollapseBlock heading="Section">
        <div>hidden content</div>
      </CollapseBlock>,
    );

    const chevron = container.querySelector("i")!;
    fireEvent.click(chevron);
    await waitFor(() => expect(container.querySelector(".collapse.show")).toBeInTheDocument());

    fireEvent.click(chevron);
    expect(container.querySelector(".fa-chevron-down")).toBeInTheDocument();

    // Let this transition settle too - react-bootstrap's Collapse schedules
    // its own fallback timer per transition, and leaving one in flight past
    // the end of the test leaks a timeout into whichever test runs next.
    await waitFor(() => expect(container.querySelector(".collapse.show")).not.toBeInTheDocument());
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
});
