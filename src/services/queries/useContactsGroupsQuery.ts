import { useQuery } from '@tanstack/react-query';
import { ContactService, AuthService } from '~app/services/api';

export const CONTACTS_GROUPS_KEY = 'contacts-groups';

export const useContactsGroupsQuery = ({ page, pageSize, search, orderBy }: ExpectedAny) => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    CONTACTS_GROUPS_KEY,
    {
      page,
      pageSize,
      search,
      sort: orderBy,
      businessId,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: ContactGroup[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ContactService.getContactGroups({
        page,
        pageSize,
        sort: orderBy,
        search,
      }),
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
