import { useQuery } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const AUTO_LABEL_KEY = 'auto_label';

export const useGetAutoLabelQuery = () => {
  const queryKey = [AUTO_LABEL_KEY];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<AutoLabelResponse, Error>({
    queryKey,
    queryFn: () => ChatService.getOrCreateAutoLabel(),
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
