import { useQuery } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const MASS_UPLOAD_FILE_CONTACT_KEY = 'mass-upload-file-contact';

export const useGetMassUploadContactFileQuery = ({ page, pageSize, enabled }: ExpectedAny) => {
  const queryKey = [
    MASS_UPLOAD_FILE_CONTACT_KEY,
    {
      page,
      pageSize,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<MassUpload[], Error>({
    queryKey,
    queryFn: () =>
      ContactService.geContactMassUploads({
        page,
        pageSize,
      }),
    retry: 0,
    enabled,
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
