import { useMutation } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const useCreateExportGoodsMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    CreateExportGoodsForm,
    Error,
    CreateExportGoodsForm
  >({
    mutationFn: (data: CreateExportGoodsForm) => {
      return InventoryService.createExportGoods(data);
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
