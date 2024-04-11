import { useMutation } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const useUpdateExportGoodsMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    { id: string; body: CreateExportGoodsForm }
  >({
    mutationFn: ({ id, body }: { id: string; body: CreateExportGoodsForm }) => {
      return InventoryService.updateExportGoods(id, body);
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
