import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { PrefetchBoundaryProps } from "@/types";

export default async function PrefetchBoundary({
  prefetchFn,
  children,
}: PrefetchBoundaryProps) {
  const queryClient = new QueryClient();

  try {
    await prefetchFn(queryClient);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[SSR Prefetch Error]:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
