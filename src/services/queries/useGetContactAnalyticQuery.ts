import { useQuery } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const CONTACT_ANALYTIC_KEY = 'contact-analytic';

export const useGetContactAnalyticQuery = (option: string) => {
  const queryKey = [
    CONTACT_ANALYTIC_KEY,
    {
      option,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<ContactAnalytic, Error>({
    queryKey,
    queryFn: () => ContactService.getContactAnalytic(option),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
    enabled: !!option,
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
