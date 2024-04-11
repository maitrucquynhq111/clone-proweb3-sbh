import { useMutation } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const useExportDetailInboundMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error, string>({
    mutationFn: (po_code: string) => {
      return InventoryService.exportDetailInbound({ po_code });
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
