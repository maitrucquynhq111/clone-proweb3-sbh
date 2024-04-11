import { useQuery } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const FREQUENTLY_QUESTION_KEY = 'frequently-question';

export const useGetFrequentlyQuestion = ({ business_has_page_id }: FrequentlyQuestionParams) => {
  const queryKey = [FREQUENTLY_QUESTION_KEY, { business_has_page_id }];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: FrequentlyQuestion[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () => ChatService.getFrequentlyQuestion({ business_has_page_id }),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: !!business_has_page_id,
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
