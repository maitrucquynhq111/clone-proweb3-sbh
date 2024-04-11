import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useUpdateConversationMutation = () => {
  const { data, error, isLoading, isError, isSuccess, mutate, mutateAsync } = useMutation<
    Conversation,
    Error,
    { id: string; data: PendingUpdateConversation }
  >({
    mutationFn: ({ id, data }: { id: string; data: PendingUpdateConversation }) => {
      return ChatService.updateConversation(id, data);
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
