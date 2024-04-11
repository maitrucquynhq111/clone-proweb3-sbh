import { useMutation } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const useUpdateProductAddOnGroupMutation = () => {
  const { data, error, isLoading, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    PendingAddOnGroup
  >({
    mutationFn: (variable: PendingAddOnGroup) => {
      return ProductService.updateAddOnGroup(variable);
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
