import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useUpdateCustomerPoint = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    Contact,
    Error,
    PedingCustomerPoint
  >({
    mutationFn: (data: PedingCustomerPoint) => {
      return ContactService.updateCustomerPoint(data);
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
