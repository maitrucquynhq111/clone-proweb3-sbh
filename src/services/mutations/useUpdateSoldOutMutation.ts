import { useMutation } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const useUpdateSoldOutMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    PendingSoldOut[]
  >({
    mutationFn: (data: PendingSoldOut[]) => {
      return ProductService.updateSoldOut(data);
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
