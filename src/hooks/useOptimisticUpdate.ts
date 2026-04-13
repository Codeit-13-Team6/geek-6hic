import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ToastCommon } from "@/components/ui/ToastCommon";

interface OptimisticMutationConfig<TData, TVariables> {
  queryKey: QueryKey;
  updater: (oldData: TData, variables: TVariables) => TData;
  invalidateKeys?: QueryKey[];
  onErrorMessage?: string;
}

export function useOptimisticMutation<TData, TVariables>(
  queryClient: QueryClient,
  config: OptimisticMutationConfig<TData, TVariables>,
) {
  const { queryKey, updater, invalidateKeys, onErrorMessage } = config;

  return {
    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<TData>(queryKey);

      queryClient.setQueryData<TData>(queryKey, (old) => {
        if (!old) return old;
        return updater(old, variables);
      });

      return { previous };
    },
    onError: (
      _error: Error,
      _variables: TVariables,
      context: { previous?: TData } | undefined,
    ) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      if (onErrorMessage) {
        ToastCommon({ message: onErrorMessage, type: "error" });
      }
    },
    onSettled: () => {
      const keys = invalidateKeys ?? [queryKey];
      keys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  };
}
