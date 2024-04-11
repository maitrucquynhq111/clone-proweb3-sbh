import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useSyncContactChatMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    SyncContactChatBody
  >({
    mutationFn: (variables: SyncContactChatBody) => {
      return ContactService.syncContactChat(variables);
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
