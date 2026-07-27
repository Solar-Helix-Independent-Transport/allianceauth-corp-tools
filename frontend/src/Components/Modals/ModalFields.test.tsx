import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DateToFields, IntToFields, StrIntToFields, StrToFields } from "./ModalFields";

describe("StrToFields", () => {
  it("renders the text label plus the value wrapped in pre/post text", () => {
    render(
      <table>
        <tbody>
          <StrToFields strValue="1000" text="Range" valuePre="~" valuePost="m" />
        </tbody>
      </table>,
    );

    expect(screen.getByText("Range")).toBeInTheDocument();
    expect(screen.getByText("~ 1000 m")).toBeInTheDocument();
  });

  it("still renders the row for children even with no strValue", () => {
    render(
      <table>
        <tbody>
          <StrToFields text="Extra">
            <span>custom child</span>
          </StrToFields>
        </tbody>
      </table>,
    );

    expect(screen.getByText("Extra")).toBeInTheDocument();
    expect(screen.getByText("custom child")).toBeInTheDocument();
  });

  it("renders nothing when there is neither a strValue nor children", () => {
    const { container } = render(
      <table>
        <tbody>
          <StrToFields text="Nothing" />
        </tbody>
      </table>,
    );

    expect(container.querySelector("tr")).not.toBeInTheDocument();
  });
});

describe("DateToFields", () => {
  it("renders the date formatted via toLocaleString", () => {
    render(
      <table>
        <tbody>
          <DateToFields dateStrValue="2024-01-01T00:00:00Z" text="Created" />
        </tbody>
      </table>,
    );

    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText(new Date("2024-01-01T00:00:00Z").toLocaleString())).toBeInTheDocument();
  });

  it("renders nothing when dateStrValue is falsy", () => {
    const { container } = render(
      <table>
        <tbody>
          <DateToFields text="Created" />
        </tbody>
      </table>,
    );
    expect(container.querySelector("tr")).not.toBeInTheDocument();
  });
});

describe("IntToFields", () => {
  it("renders the number formatted with toLocaleString", () => {
    render(
      <table>
        <tbody>
          <IntToFields intValue={1234567} text="Volume" />
        </tbody>
      </table>,
    );
    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("renders nothing when intValue is exactly 0", () => {
    const { container } = render(
      <table>
        <tbody>
          <IntToFields intValue={0} text="Volume" />
        </tbody>
      </table>,
    );
    expect(container.querySelector("tr")).not.toBeInTheDocument();
  });
});

describe("StrIntToFields", () => {
  it("parses the string to a number and renders it formatted", () => {
    render(
      <table>
        <tbody>
          <StrIntToFields strValue="98765" text="Count" />
        </tbody>
      </table>,
    );
    expect(screen.getByText("98,765")).toBeInTheDocument();
  });

  it("renders nothing when strValue is falsy", () => {
    const { container } = render(
      <table>
        <tbody>
          <StrIntToFields text="Count" />
        </tbody>
      </table>,
    );
    expect(container.querySelector("tr")).not.toBeInTheDocument();
  });
});
