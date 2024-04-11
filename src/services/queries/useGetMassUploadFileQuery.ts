import { useQuery } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const MASS_UPLOAD_FILE_KEY = 'mass-upload-file';

export const useGetMassUploadFileQuery = ({ page, pageSize, upload_type, enabled }: ExpectedAny) => {
  const queryKey = [
    MASS_UPLOAD_FILE_KEY,
    {
      page,
      pageSize,
      upload_type,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<MassUpload[], Error>({
    queryKey,
    queryFn: () =>
      ProductService.getMassUploads({
        page,
        pageSize,
        upload_type,
      }),
    retry: 0,
    enabled: enabled,
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
