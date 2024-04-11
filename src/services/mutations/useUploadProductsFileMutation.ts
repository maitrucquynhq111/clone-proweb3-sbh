import { useMutation } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const useUploadProductsFileMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variables: ExpectedAny) => {
      return ProductService.uploadProductFile(variables.file);
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
