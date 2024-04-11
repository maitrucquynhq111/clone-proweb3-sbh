import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useUpdateContactLabelMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ContactLabel,
    Error,
    PendingContactLabel
  >({
    mutationFn: (body: PendingContactLabel) => {
      return ContactService.updateContactLabel(body);
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
