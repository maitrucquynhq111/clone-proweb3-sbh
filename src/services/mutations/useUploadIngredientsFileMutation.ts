import { useMutation } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const useUploadIngredientsFileMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variables: ExpectedAny) => {
      return ProductService.uploadIngredientsFile(variables.file);
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
