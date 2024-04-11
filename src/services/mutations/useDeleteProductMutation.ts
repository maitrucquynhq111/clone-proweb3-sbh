import { useMutation } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const useDeleteProductMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error, string>({
    mutationFn: (id: string) => {
      return ProductService.deleteProduct(id);
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
