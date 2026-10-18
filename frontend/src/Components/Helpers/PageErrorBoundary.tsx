import React from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useLocation } from "react-router";
import ErrorBoundary from "./ErrorBoundary";

/** Error boundary for a routed page: clears when the route changes, and
 * "Try again" also resets the failed queries so they refetch on remount. */
const PageErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary resetKey={pathname} onReset={reset}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default PageErrorBoundary;
