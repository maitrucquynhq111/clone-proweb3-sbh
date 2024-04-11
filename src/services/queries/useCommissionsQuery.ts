import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '~app/configs';
import { AffiliateService } from '~app/services/api';
import { buildSortByQuery } from '~app/utils/helpers';

export const COMMISSIONS_KEY = 'commissions';

const convertSort = ({ id, direction }: SorterProps) => {
  if (id === 'upgraded_at' && direction === 'asc') return 'asc';
  if (id === 'upgraded_at' && direction === 'desc') return 'desc';
  return 'desc';
};

export const useCommissionsQuery = ({
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  filter_key,
  search,
  start_time,
  end_time,
  sender_phone,
  orderBy,
}: GetAffiliateListParams) => {
  const sort = buildSortByQuery(orderBy);
  const queryKey = [
    AffiliateService,
    {
      page,
      page_size: pageSize,
      start_time,
      end_time,
      search,
      filter_key,
      sender_phone,
      ...sort,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    {
      data: Commission[];
      meta: ResponseMeta & {
        total_upgrade: number;
        total_commission: number;
      };
    },
    Error
  >({
    queryKey,
    queryFn: () =>
      AffiliateService.getCommissions({
        page,
        pageSize: pageSize,
        start_time,
        end_time,
        search,
        filter_key,
        sender_phone,
        sort: (orderBy && convertSort(orderBy)) || '',
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
