import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CorpLoader, ErrorLoader, LdsLoader, PanelLoader } from "./loaders";

describe("LdsLoader", () => {
  it("appends the given className to its own", () => {
    const { container } = render(<LdsLoader className="extra-class" />);
    expect(container.firstChild).toHaveClass("extra-class");
  });
});

// Each loader's default parameter (`props: LoaderProps = { title: "..." }`)
// only kicks in when the function is called with literally no argument -
// JSX always supplies an object (`{}` for `<PanelLoader />`), so that default
// never actually applies through normal usage. These tests pin down that
// real behaviour (an empty heading) rather than the unreachable intent.
describe("PanelLoader", () => {
  it("renders an empty heading when used via JSX with no props", () => {
    const { container } = render(<PanelLoader />);
    expect(container.querySelector("h3")).toBeEmptyDOMElement();
  });

  it("renders a custom title and message", () => {
    render(<PanelLoader title="Fetching" message="Please wait" />);
    expect(screen.getByText("Fetching")).toBeInTheDocument();
    expect(screen.getByText("Please wait")).toBeInTheDocument();
  });
});

describe("ErrorLoader", () => {
  it("renders an empty heading when used via JSX with no props", () => {
    const { container } = render(<ErrorLoader />);
    expect(container.querySelector("h3")).toBeEmptyDOMElement();
  });

  it("renders a custom title and message", () => {
    render(<ErrorLoader title="Boom" message="Something broke" />);
    expect(screen.getByText("Boom")).toBeInTheDocument();
    expect(screen.getByText("Something broke")).toBeInTheDocument();
  });
});

describe("CorpLoader", () => {
  it("renders an empty heading when used via JSX with no props", () => {
    const { container } = render(<CorpLoader />);
    expect(container.querySelector("h3")).toBeEmptyDOMElement();
  });
});
