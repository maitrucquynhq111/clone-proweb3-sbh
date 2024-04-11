import { useMutation } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const useCreateImportGoodsMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    JSONRecord<InventoryCreateForm>,
    Error,
    InventoryCreateForm
  >({
    mutationFn: (data: InventoryCreateForm) => {
      return InventoryService.createImportGoods(data);
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
