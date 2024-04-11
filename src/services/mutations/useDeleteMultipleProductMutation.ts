import { useMutation } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';
import { useCacheMeQuery } from '~app/services/queries';

export const useDeleteMultipleProductMutation = () => {
  const { data: me } = useCacheMeQuery();
  const { user_info } = me || {};

  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variables: ExpectedAny) => {
      return ProductService.deleteMultiProduct({
        data: variables.productIds,
        user_id: user_info.id || '',
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
