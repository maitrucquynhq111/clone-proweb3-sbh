import { useMutation } from '@tanstack/react-query';
import { PaymentService } from '~app/services/api';

export const useCreatePaymentMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    JSONRecord<Payment>,
    Error,
    PendingPayment
  >({
    mutationFn: (variables: PendingPayment) => {
      return PaymentService.createPayment(variables);
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
