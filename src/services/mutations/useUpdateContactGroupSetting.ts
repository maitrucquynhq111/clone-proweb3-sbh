import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useUpdateContactGroupSetting = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ContactGroup,
    Error,
    UpdateContactGroupSettingBody
  >({
    mutationFn: (body: UpdateContactGroupSettingBody) => {
      return ContactService.updateGroupOfContactSetting(body);
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
