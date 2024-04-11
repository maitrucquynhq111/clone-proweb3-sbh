import { useQuery } from '@tanstack/react-query';
import promotionService from '~app/services/api/promotion';

type Props = { page: number; page_size: number; name?: string; sort?: string; enabled?: boolean };

export const usePromotionsQuery = ({ page, page_size, name, sort, enabled = false }: Props) => {
  const queryKey = [
    'promotion/get-list',
    {
      page,
      page_size,
      name,
      sort,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: Promotion[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () => promotionService.getPromotions({ page, page_size, name, sort }),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled,
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
