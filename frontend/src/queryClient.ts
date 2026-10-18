import { QueryClient } from "@tanstack/react-query";
import { getHttpStatus } from "./Components/Helpers/errors";

const MAX_RETRIES = 3;

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // A query that fails with nothing to show throws to the nearest
        // PageErrorBoundary, so a 403/500 shows as an error rather than as
        // an empty page. Failing a background refetch keeps the data it has.
        throwOnError: (_error, query) => query.state.data === undefined,
        // Audit data only changes when the backend refetches from ESI, so
        // switching back to the tab is no reason to reload it.
        refetchOnWindowFocus: false,
        // A 4xx won't change on retry - show it straight away rather than
        // after the retries' backoff. 5xx and network errors still retry.
        retry: (failureCount, error) => {
          const status = getHttpStatus(error);
          if (status !== undefined && status >= 400 && status < 500) return false;
          return failureCount < MAX_RETRIES;
        },
      },
    },
  });
