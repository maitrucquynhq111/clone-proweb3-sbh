import { useInfiniteQuery } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const CONVERSATION_LIST_KEY = 'conversations';

export const useGetConversationListQuery = (filter: ExpectedAny) => {
  const queryKey = [CONVERSATION_LIST_KEY, filter];

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => {
      return ChatService.getConversations({
        page: pageParam || 1,
        page_size: 20,
        ...filter,
      });
    },
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
    refetchOnMount: true,
    getNextPageParam: (_lastGroup) => {
      const { meta } = _lastGroup;
      return meta && meta?.page && meta?.page < meta?.total_pages ? meta?.page + 1 : undefined;
    },
  });

  return {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    queryKey,
  };
};
