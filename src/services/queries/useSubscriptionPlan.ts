import { useQuery } from '@tanstack/react-query';
import { AuthService, PermissionService } from '~app/services/api';

export const SUBSCRIPTION_PLAN_KEY = 'subscription_plan';

export const useSubscriptionPlan = () => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    SUBSCRIPTION_PLAN_KEY,
    {
      businessId,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<SubscriptionPlan, Error>({
    queryKey,
    queryFn: () => PermissionService.getSubscriptionPlan(),
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
