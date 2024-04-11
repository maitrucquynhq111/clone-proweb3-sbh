import { useMutation } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const useCancelDetailOutboundMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    { id: string }
  >({
    mutationFn: ({ id }: { id: string }) => {
      return InventoryService.cancelDetailOutbound(id);
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
