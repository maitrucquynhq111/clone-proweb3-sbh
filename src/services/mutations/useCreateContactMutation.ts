import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useCreateContactMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    Contact,
    Error,
    PendingContact
  >({
    mutationFn: (data: PendingContact) => {
      return ContactService.createContact(data);
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
