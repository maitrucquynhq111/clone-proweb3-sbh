import { useQuery } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const CONTACT_TRANSACTIONS_KEY = 'contact_transactions';

export const useContactTransactionsQuery = ({
  contact_id,
  page,
  pageSize,
}: {
  contact_id: string;
  page: number;
  pageSize: number;
}) => {
  const queryKey = [
    CONTACT_TRANSACTIONS_KEY,
    {
      contact_id,
      page,
      page_size: pageSize,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: ContactTransaction[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ContactService.getContactTransactions({
        contact_id,
        page,
        page_size: pageSize,
      }),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return {
    isLoading,
    isLoadingError,
    isFetching,
    error,
    data,
    isError,
    queryKey,
    refetch,
  };
};
