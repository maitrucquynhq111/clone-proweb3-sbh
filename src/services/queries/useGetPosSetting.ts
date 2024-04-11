import { useQuery } from '@tanstack/react-query';
import { SettingService, AuthService } from '~app/services/api';

export const POS_SETTING_KEY = 'pos-setting';

export const useGetPosSetting = () => {
  const businessId = AuthService.getBusinessId();

  const queryKey = [
    POS_SETTING_KEY,
    {
      businessId,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<POSSettings, Error>({
    queryKey,
    queryFn: () => SettingService.getPosSetting(),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
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
