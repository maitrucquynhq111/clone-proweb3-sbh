import { useQuery } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const CURRENT_LINK_PAGE_KEY = 'current_link_page';

export const useGetCurrentLinkPage = ({ provider }: { provider?: string }) => {
  const queryKey = [CURRENT_LINK_PAGE_KEY, { provider }];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<LinkPage, Error>({
    queryKey,
    queryFn: () => ChatService.getCurrentLink(provider),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
    meta: {
      ignoreError: true,
    },
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
