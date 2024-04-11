import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useReactMessageMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variables: ExpectedAny) => {
      return ChatService.reactMessage({
        message_id: variables.messageId,
        participant_id: variables.participantId,
        react_type: variables.reactType,
      });
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
