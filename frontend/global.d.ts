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

  class CopyToClipboard extends React.Component<PropsWithChildren<Props>, {}> {}
  export default CopyToClipboard;
}

declare module "react-slider" {
  import React from "react";

  class ReactSlider extends React.Component<PropsWithChildren<any>, {}> {}
  export default ReactSlider;
}
