import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useUpdateContactNoteMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    {
      id: string;
      body: PendingNote;
    }
  >({
    mutationFn: (data: { id: string; body: PendingNote }) => {
      return ContactService.updateNote({ id: data.id, body: data.body });
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
