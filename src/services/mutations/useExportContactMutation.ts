import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useExportContactMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error, string>({
    mutationFn: (contact_group_ids?: string) => {
      return ContactService.exportContact(contact_group_ids);
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
