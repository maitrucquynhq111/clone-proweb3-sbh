import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useUpdateContactMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    Contact,
    Error,
    { id: string; contact: PendingContact }
  >({
    mutationFn: ({ id, contact }: { id: string; contact: PendingContact }) => {
      return ContactService.updateContact({ id, contact });
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
