import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useFillHeight } from "./useFillHeight";

describe("useFillHeight", () => {
  let originalInnerHeight: number;

  beforeEach(() => {
    originalInnerHeight = window.innerHeight;
  });

  afterEach(() => {
    Object.defineProperty(window, "innerHeight", {
      value: originalInnerHeight,
      writable: true,
      configurable: true,
    });
  });

  it("defaults to the 420px minimum before the ref is attached to anything", () => {
    const { result } = renderHook(() => useFillHeight<HTMLDivElement>());
    expect(result.current.height).toBe(420);
  });

  it("fills to the window height minus the element's top offset and the bottom margin", () => {
    Object.defineProperty(window, "innerHeight", {
      value: 1000,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useFillHeight<HTMLDivElement>());
    const div = document.createElement("div");
    vi.spyOn(div, "getBoundingClientRect").mockReturnValue({ top: 100 } as DOMRect);
    document.body.appendChild(div);

    act(() => {
      (result.current.ref as React.MutableRefObject<HTMLDivElement | null>).current = div;
      window.dispatchEvent(new Event("resize"));
    });

    // 1000 - 100 (top) - 24 (bottom margin) = 876
    expect(result.current.height).toBe(876);

    document.body.removeChild(div);
  });

  it("never goes below the 420px minimum even when the element sits far down the page", () => {
    Object.defineProperty(window, "innerHeight", {
      value: 500,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useFillHeight<HTMLDivElement>());
    const div = document.createElement("div");
    vi.spyOn(div, "getBoundingClientRect").mockReturnValue({ top: 400 } as DOMRect);
    document.body.appendChild(div);

    act(() => {
      (result.current.ref as React.MutableRefObject<HTMLDivElement | null>).current = div;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.height).toBe(420);

    document.body.removeChild(div);
  });
});
