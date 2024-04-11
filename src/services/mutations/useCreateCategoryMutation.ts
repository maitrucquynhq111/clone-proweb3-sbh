import { useMutation } from '@tanstack/react-query';
import { CashbookService } from '~app/services/api';

export const useCreateCategoryMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    CashbookCategory,
    Error,
    PendingCashbookCategory
  >({
    mutationFn: (data: PendingCashbookCategory) => {
      return CashbookService.createCashbookCategory(data);
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
