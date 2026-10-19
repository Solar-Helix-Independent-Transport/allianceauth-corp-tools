import React, { Suspense } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { PanelLoader } from "../Loaders/loaders";
import ErrorBoundary from "./ErrorBoundary";

/** Error boundary for a routed page: clears when the route changes, and
 * "Try again" also resets the failed queries so they refetch on remount.
 * Also shows a loader while a lazily loaded page's code downloads. */
const PageErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary resetKey={pathname} onReset={reset}>
          <Suspense fallback={<PanelLoader title={t("Loading")} />}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default PageErrorBoundary;
