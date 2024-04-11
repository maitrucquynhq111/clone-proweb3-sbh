import { useMutation } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const useAssignProductsToCategoriesMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variables: ExpectedAny) => {
      return ProductService.addProductToCategory({
        product_ids: variables.productIds,
        category_ids: variables.categoryIds,
      });
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
