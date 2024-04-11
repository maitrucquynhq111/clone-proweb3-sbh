import { useMutation } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const useCreateProductCategoryMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    Category,
    Error,
    PendingCashbookCategory
  >({
    mutationFn: (data: PendingProductCategory) => {
      return ProductService.createCategory(data);
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
