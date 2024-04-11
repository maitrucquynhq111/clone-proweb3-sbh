import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useUpdateAutoLabelMutation = () => {
  const { data, error, isLoading, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    AutoLabelBody
  >({
    mutationFn: (body: AutoLabelBody) => {
      return ChatService.updateAutoLabelSetting(body);
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
