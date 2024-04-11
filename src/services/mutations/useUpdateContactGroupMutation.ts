import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useUpdateContactGroupMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ContactGroup,
    Error,
    { id: string; contact: PendingContactGroup }
  >({
    mutationFn: ({ id, contact }: { id: string; contact: PendingContactGroup }) => {
      return ContactService.updateContactGroup({ id, contact });
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
