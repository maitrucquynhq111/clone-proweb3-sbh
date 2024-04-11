import { useQuery } from '@tanstack/react-query';
import { ContactService, AuthService } from '~app/services/api';

export const CONTACTS_LABELS_KEY = 'contacts-label';

export const useContactsLabelsQuery = ({ page, pageSize, name }: ExpectedAny) => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    CONTACTS_LABELS_KEY,
    {
      page,
      pageSize,
      name,
      businessId,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: ContactLabel[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ContactService.getContactLabels({
        page,
        pageSize,
        name,
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
