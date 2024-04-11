import { useMutation } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const useUpdateProductMutation = () => {
  const { data, error, isLoading, isError, isSuccess, mutate, mutateAsync } = useMutation<JSONRecord<Product>, Error>({
    mutationFn: (variable: ExpectedAny) => {
      return ProductService.updateProduct(variable.id, variable.product);
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
