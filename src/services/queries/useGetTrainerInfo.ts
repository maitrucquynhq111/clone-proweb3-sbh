import { useQuery } from '@tanstack/react-query';
import { AffiliateService } from '~app/services/api';

export const TRAINER_INFO = 'trainer_info';

export const useGetTrainerInfo = () => {
  const { isLoading, error, data, isError, isFetching, isLoadingError } = useQuery<TrainerInfo, Error>({
    queryKey: [TRAINER_INFO],
    queryFn: AffiliateService.getTrainerInfo,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    isLoadingError,
    isFetching,
    isLoading,
    isError,
    error,
    data,
  };
};
