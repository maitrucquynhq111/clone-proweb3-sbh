import { useQuery } from '@tanstack/react-query';
import { SettingService, AuthService } from '~app/services/api';
import { useCacheMeQuery } from '~app/services/queries';

export const INVOICE_SETTING_KEY = 'invoice-setting';

export const useGetInvoiceSetting = () => {
  const businessId = AuthService.getBusinessId();
  const { data: me } = useCacheMeQuery();

  const phone_number = me?.business_info?.current_business?.phone_number || '';

  const queryKey = [
    INVOICE_SETTING_KEY,
    {
      phone_number,
      businessId,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: ExpectedAny; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      SettingService.getInvoiceSetting({
        phone_number,
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
    data,
    isError,
    queryKey,
    refetch,
  };
};
