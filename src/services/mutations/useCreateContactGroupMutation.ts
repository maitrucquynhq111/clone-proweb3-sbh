import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useCreateContactGroupMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ContactGroup,
    Error,
    PendingContactGroup
  >({
    mutationFn: (data: PendingContactGroup) => {
      return ContactService.createContactGroup(data);
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
