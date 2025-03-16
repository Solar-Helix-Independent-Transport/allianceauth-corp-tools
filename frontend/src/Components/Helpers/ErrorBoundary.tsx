import { ErrorLoader } from "../Loaders/loaders";
import React, { Component, ErrorInfo } from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  title?: string;
  message?: string;
  trace?: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      message: "",
      trace: "",
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error: ", error, errorInfo);
    this.setState({
      hasError: true,
      title: error.name,
      message: error.message,
      trace: String(errorInfo.componentStack),
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <ErrorLoader title={this.state.title} message={this.state.message} />
          <p className="text-center">
            You should not be seeing this message, please report this error to your Admininstrators.
            <br />
            Should they need help they can find help in the Corp Tools Channel on the{" "}
            <a href="https://discord.gg/fjnHAmk">Alliance Auth Discord</a> or create an issue on{" "}
            <a href="https://github.com/Solar-Helix-Independent-Transport/allianceauth-corp-tools">
              GitHub
            </a>
            .
          </p>
          <div style={{ justifyContent: "center" }} className="d-flex">
            <pre style={{ maxWidth: "1000px" }} className="border">
              {this.state.trace}
            </pre>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
