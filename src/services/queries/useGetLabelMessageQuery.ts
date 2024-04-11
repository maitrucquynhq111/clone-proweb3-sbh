import { useQuery } from '@tanstack/react-query';
import { AuthService, ChatService } from '~app/services/api';

export const LABEL_MESSAGE_KEY = 'label-message';

export const useGetLabelMessageQuery = ({ page, pageSize, search, sort }: CommonParams) => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    LABEL_MESSAGE_KEY,
    {
      page,
      pageSize,
      search,
      sort,
      businessId,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: Label[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ChatService.getLabels({
        page,
        pageSize,
        sort,
        search,
      }),
    staleTime: 2 * 60 * 1000,
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
