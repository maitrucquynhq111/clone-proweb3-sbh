import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useRevalidateGroupOfContactSettingMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error, string>({
    mutationFn: (id: string) => {
      return ContactService.revalidateGroupOfContactSetting(id);
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
