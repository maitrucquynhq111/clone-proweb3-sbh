import { useMutation } from '@tanstack/react-query';
import StaffService from '~app/services/api/staff';

export const useConfirmInviteMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    ConfirmInviteBody
  >({
    mutationFn: (variables: ConfirmInviteBody) => {
      return StaffService.confirmInvite(variables);
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
