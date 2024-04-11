import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useCreateContactInChat = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    Contact,
    Error,
    CreateContactInChatBody
  >({
    mutationFn: (body: CreateContactInChatBody) => {
      return ContactService.createContactInChat(body);
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
