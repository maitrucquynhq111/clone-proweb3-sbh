import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useUploadContactsFileMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variables: ExpectedAny) => {
      return ContactService.uploadContactFile(variables.file);
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
