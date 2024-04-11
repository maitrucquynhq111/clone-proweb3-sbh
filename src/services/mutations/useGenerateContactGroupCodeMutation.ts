import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useGenerateContactGroupCodeMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<string, Error, string>({
    mutationFn: (group_name: string) => {
      return ContactService.generateContactGroupCode(group_name);
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
