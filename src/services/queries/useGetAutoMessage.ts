import { useQuery } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const AUTO_MESSAGE_KEY = 'auto_message';

export const useGetAutoMessage = ({ business_has_page_id }: AbsenceMessageParams) => {
  const { isLoading, error, data, isError, isFetching, isLoadingError } = useQuery<AutoMessage, Error>({
    queryKey: [AUTO_MESSAGE_KEY, { business_has_page_id }],
    queryFn: () => ChatService.getAutoMessage({ business_has_page_id }),
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!business_has_page_id,
  });

  return {
    isLoadingError,
    isFetching,
    isLoading,
    isError,
    error,
    data: data?.page_auto_message || null,
  };
};
