import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useUpdateContactDeliveringAddressMutation = () => {
  const { data, error, isLoading, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ContactDeliveringAddress,
    Error,
    { id: string; body: ContactDeliveringAddressBody }
  >({
    mutationFn: (variable: { id: string; body: ContactDeliveringAddressBody }) => {
      return ContactService.updateContactDeliveringAddress(variable.id, variable.body);
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
