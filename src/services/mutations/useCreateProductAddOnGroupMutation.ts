import { useMutation } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const useCreateProductAddOnGroupMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    PendingAddOnGroup
  >({
    mutationFn: (variables: PendingAddOnGroup) => {
      return ProductService.createAddOnGroup(variables);
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
