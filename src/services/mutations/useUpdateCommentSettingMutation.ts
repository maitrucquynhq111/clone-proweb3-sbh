import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useUpdateCommentSettingMutation = () => {
  const { data, error, isLoading, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    CommentSettingBody
  >({
    mutationFn: (body: CommentSettingBody) => {
      return ChatService.updateCommentSetting(body);
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
