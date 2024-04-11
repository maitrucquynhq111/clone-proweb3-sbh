import { useQuery } from '@tanstack/react-query';
import { CashbookService } from '../api';

type Props = { type?: string; page: number; page_size: number };

export const useCashbookCategoriesQuery = ({ page, page_size, type }: Props) => {
  const queryKey = [
    'category-transaction/get-list',
    {
      type,
      page,
      page_size,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: CashbookCategory[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () => CashbookService.getCashbookCategories({ type, page, page_size }),
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1 * 1000 * 60,
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
