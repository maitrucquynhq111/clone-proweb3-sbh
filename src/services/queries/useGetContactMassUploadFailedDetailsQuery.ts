import { useQuery } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const CONTACT_MASS_UPLOAD_FAILED_KEY = 'contact-mass-upload-failed';

export const useGetContactMassUploadFailedDetailsQuery = ({ page, pageSize, id }: ExpectedAny) => {
  const queryKey = [
    CONTACT_MASS_UPLOAD_FAILED_KEY,
    {
      page,
      pageSize,
      id,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: MassUploadFailed[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ContactService.getContactMassUploadsFailed({
        page,
        pageSize,
        id,
      }),
    retry: 0,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
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
