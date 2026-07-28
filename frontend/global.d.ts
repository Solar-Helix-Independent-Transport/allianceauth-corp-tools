declare module "*.module.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "react-copy-to-clipboard" {
  import React from "react";

  interface Options {
    debug: boolean;
    message: string;
  }

  interface Props {
    text: string;
    onCopy?(a: string, b: boolean): void;
    options?: Options;
    children?: ReactNode;
  }

  class CopyToClipboard extends React.Component<PropsWithChildren<Props>, Record<string, never>> {}
  export default CopyToClipboard;
}

declare module "react-slider" {
  import React from "react";

  interface ReactSliderProps<T extends number | number[] = number | number[]> {
    className?: string;
    thumbClassName?: string;
    trackClassName?: string;
    min?: number;
    max?: number;
    step?: number;
    value?: T;
    defaultValue?: T;
    pearling?: boolean;
    minDistance?: number;
    disabled?: boolean;
    orientation?: "horizontal" | "vertical";
    invert?: boolean;
    ariaLabel?: string | string[];
    onChange?(value: T, index: number): void;
    onAfterChange?(value: T, index: number): void;
    onBeforeChange?(value: T, index: number): void;
  }

  class ReactSlider<T extends number | number[] = number | number[]> extends React.Component<
    PropsWithChildren<ReactSliderProps<T>>,
    Record<string, never>
  > {}
  export default ReactSlider;
}
