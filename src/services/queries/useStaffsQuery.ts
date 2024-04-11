import { useQuery } from '@tanstack/react-query';
import { AuthService, StaffService } from '~app/services/api';

const STAFFS_KEY = 'staffs';

export const useStaffsQuery = ({ page, pageSize, search, sort }: CommonParams) => {
  const business_id = AuthService.getBusinessId();
  const queryKey = [
    STAFFS_KEY,
    {
      page,
      pageSize,
      business_id,
      search,
      sort,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: StaffInfo[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      StaffService.getStaffs({
        page,
        pageSize,
        search,
        sort,
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
