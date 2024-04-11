import { useQuery } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const MASS_UPLOAD_FAILED_KEY = 'mass-upload-failed';

export const useGetMassUploadFailedDetailsQuery = ({ page, pageSize, id }: ExpectedAny) => {
  const queryKey = [
    MASS_UPLOAD_FAILED_KEY,
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
      ProductService.getMassUploadsFailed({
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
