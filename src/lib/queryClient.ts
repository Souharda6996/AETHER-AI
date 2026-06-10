import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5 minutes — don't refetch data that was fetched within this window
      staleTime: 1000 * 60 * 5,
      // 30 minutes — keep unused data in cache before garbage collecting
      gcTime: 1000 * 60 * 30,
      // Only retry once on failure to avoid slow UX on bad connections
      retry: 1,
      // Prevent unnecessary refetch when user switches browser tabs
      refetchOnWindowFocus: false,
      // Always refetch when internet reconnects (correctness over caching)
      refetchOnReconnect: "always",
    },
    mutations: {
      // Don't retry mutations — they can have side effects
      retry: 0,
    },
  },
});
