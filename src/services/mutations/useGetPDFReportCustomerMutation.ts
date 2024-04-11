import { useMutation } from '@tanstack/react-query';
import { CashbookService } from '~app/services/api';

export const useGetPDFReportCustomerMutation = () => {
  const { data, error, isLoading, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variable: ExpectedAny) => {
      return CashbookService.exportPDFTransactions({
        contact_id: variable.contactId,
      });
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
