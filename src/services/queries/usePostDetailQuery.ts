import { useQuery } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const POST_DETAIL_KEY = 'POST_DETAIL';

export const usePostDetailQuery = ({ post_id, participant_id }: { post_id: string; participant_id: string }) => {
  const queryKey = [POST_DETAIL_KEY];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<PostDetail, Error>({
    queryKey,
    queryFn: () =>
      ChatService.getPostDetail({
        post_id,
        participant_id,
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
    data: data,
    isError,
    queryKey,
    refetch,
  };
};
