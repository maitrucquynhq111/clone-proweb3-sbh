import { useQuery } from '@tanstack/react-query';
import { AuthService, ProductService } from '~app/services/api';

export const UOMS_KEY = 'uoms';

export const useGetUomsQuery = ({ name, page, pageSize }: ExpectedAny) => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    UOMS_KEY,
    {
      businessId,
      name,
      page,
      pageSize,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: Uom[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ProductService.getUoms({
        name,
        page,
        pageSize,
      }),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
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
