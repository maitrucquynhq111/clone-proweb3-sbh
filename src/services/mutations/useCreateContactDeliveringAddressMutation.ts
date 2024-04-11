import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useCreateContactDeliveringAddressMutation = () => {
  const { data, error, isLoading, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ContactDeliveringAddress,
    Error,
    { contact_id: string; body: ContactDeliveringAddressBody }
  >({
    mutationFn: (variable: { contact_id: string; body: ContactDeliveringAddressBody }) => {
      return ContactService.createContactDeliveringAddress(variable.contact_id, variable.body);
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
