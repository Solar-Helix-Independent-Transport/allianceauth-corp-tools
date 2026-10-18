import { ErrorLoader } from "../Loaders/loaders";
import React, { Component, ErrorInfo } from "react";
import { Button } from "react-bootstrap";
import { WithTranslation, withTranslation } from "react-i18next";
import { getHttpStatus } from "./errors";

interface Props extends WithTranslation {
  children: React.ReactNode;
  /** The boundary clears itself when this changes - e.g. the route path, so
   * navigating away from a broken page doesn't keep showing its error. */
  resetKey?: unknown;
  /** Called on "Try again" and on a resetKey change, before re-rendering. */
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  title?: string;
  message?: string;
  trace?: string;
  status?: number;
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

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      title: error.name,
      message: error.message,
      status: getHttpStatus(error),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error: ", error, errorInfo);
    this.setState({ trace: String(errorInfo.componentStack) });
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.reset();
    }
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, title: undefined, message: "", trace: "", status: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { t } = this.props;
      const tryAgain = (
        <div className="text-center mb-3">
          <Button variant="primary" onClick={this.reset}>
            {t("Try again")}
          </Button>
        </div>
      );
      if (this.state.status !== undefined) {
        // A failed request, not a bug - no "report this" text or stack.
        return (
          <>
            <ErrorLoader
              title={
                this.state.status
                  ? t("Error {{status}}", { status: this.state.status })
                  : t("Connection problem")
              }
              message={
                this.state.status === 403
                  ? t("You do not have permission to view this.")
                  : this.state.message
              }
            />
            {tryAgain}
          </>
        );
      }
      return (
        <>
          <ErrorLoader title={this.state.title} message={this.state.message} />
          <p className="text-center">
            {t(
              "You should not be seeing this message, please report this error to your Admininstrators.",
            )}
            <br />
            {t("Should they need help they can find help in the Corp Tools Channel on the")}{" "}
            <a href="https://discord.gg/fjnHAmk">{t("Alliance Auth Discord")}</a>{" "}
            {t("or create an issue on")}{" "}
            <a href="https://github.com/Solar-Helix-Independent-Transport/allianceauth-corp-tools">
              GitHub
            </a>
            .
          </p>
          {tryAgain}
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

export default withTranslation()(ErrorBoundary);
