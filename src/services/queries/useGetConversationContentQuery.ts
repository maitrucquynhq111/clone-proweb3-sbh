import { useInfiniteQuery } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const CONVERSATION_CONTENT_KEY = 'conversation/get-messages';

export const useGetConversationContentQuery = (id: string) => {
  const queryKey = [CONVERSATION_CONTENT_KEY, id];

  const { status, data, isFetchingNextPage, fetchNextPage, hasNextPage, refetch, isLoading, isFetching } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam = 1 }) => {
        return ChatService.getConversationMessages({
          conversation_id: id,
          sender_type: 'business',
          page: pageParam,
          page_size: 10,
          sort: 'updated_at asc',
        });
      },
      retry: 0,
      enabled: id ? true : false,
      refetchOnWindowFocus: false,
      keepPreviousData: false,
      getNextPageParam: (_lastGroup: ExpectedAny) => {
        const {
          meta: { page, total_pages },
        } = _lastGroup;
        return page && page < total_pages ? page + 1 : undefined;
      },
    });

  return {
    status,
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    queryKey,
    refetch,
    isLoading,
    isFetching,
  };
};
