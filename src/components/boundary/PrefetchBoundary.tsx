import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ReactNode } from "react";

interface PrefetchBoundaryProps {
  children: ReactNode;
  prefetchFn: (qc: QueryClient) => Promise<void>;
}

export default async function PrefetchBoundary({
  prefetchFn,
  children,
}: PrefetchBoundaryProps) {
  const queryClient = new QueryClient();

  try {
    await prefetchFn(queryClient);
  } catch (error) {
    console.error("[SSR Prefetch Error]:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
