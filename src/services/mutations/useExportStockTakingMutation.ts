import { useMutation } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const useExportStockTakingMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    { start_time: string; end_time: string }
  >({
    mutationFn: ({ start_time, end_time }: { start_time: string; end_time: string }) => {
      return InventoryService.exportStockTaking({ start_time, end_time });
    },
  });

  return {
    isLoading,
    isSuccess,
    error,
    data,
    isError,
    mutate,
    mutateAsync,
  };
};
