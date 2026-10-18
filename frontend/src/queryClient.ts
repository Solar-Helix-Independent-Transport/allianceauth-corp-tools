import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // A query that fails with nothing to show throws to the nearest
        // PageErrorBoundary, so a 403/500 shows as an error rather than as
        // an empty page. Failing a background refetch keeps the data it has.
        throwOnError: (_error, query) => query.state.data === undefined,
      },
    },
  });
