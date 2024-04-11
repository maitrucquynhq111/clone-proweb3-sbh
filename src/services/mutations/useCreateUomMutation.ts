import { useMutation } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const useCreateUomMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<Uom, Error, string>({
    mutationFn: (name: string) => {
      return ProductService.createUom(name);
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
