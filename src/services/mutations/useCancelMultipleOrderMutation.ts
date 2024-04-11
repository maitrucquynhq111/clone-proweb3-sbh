import { useMutation } from '@tanstack/react-query';
import { OrderService } from '~app/services/api';

export const useCancelMultipleOrderMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variables: ExpectedAny) => {
      return OrderService.cancelMultiOrder(variables);
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
