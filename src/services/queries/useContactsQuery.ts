import { useQuery } from '@tanstack/react-query';
import { ContactService, AuthService } from '~app/services/api';

export const CONTACTS_KEY = 'contacts';

export const useContactsQuery = ({
  page,
  pageSize,
  search,
  sort,
  option,
  options,
  contact_group_ids,
  tag_ids,
  has_analytic,
  option_analytic,
  enabled,
}: ExpectedAny) => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    CONTACTS_KEY,
    {
      page,
      pageSize,
      search,
      sort,
      businessId,
      option,
      options,
      contact_group_ids,
      tag_ids,
      has_analytic,
      option_analytic,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: Contact[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ContactService.getNewContacts({
        page,
        pageSize,
        sort,
        search,
        option,
        options,
        contact_group_ids,
        tag_ids,
        has_analytic,
        option_analytic,
      }),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
    enabled,
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
