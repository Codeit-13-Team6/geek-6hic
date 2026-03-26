import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { ReactNode } from "react";

interface PrefetchBoundaryProps {
  queryKey: QueryKey;
  queryFn: () => Promise<any>;
  children: ReactNode;
}

export default async function PrefetchBoundary({
  queryKey,
  queryFn,
  children,
}: PrefetchBoundaryProps) {
  const queryClient = new QueryClient();

  console.log('zzgdserver')

  try {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
    });
  } catch (error) {
    console.error(`[SSR Prefetch Error] ${queryKey}:`, error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
