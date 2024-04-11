import { useQuery } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const CONTACT_NOTES_KEY = 'contact_notes';

type Props = {
  contact_id: string;
  page: number;
  page_size: number;
};

export const useGetContactNotesQuery = ({ page, page_size, contact_id }: Props) => {
  const queryKey = [
    CONTACT_NOTES_KEY,
    {
      page,
      page_size,
      contact_id,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: Note[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ContactService.getNotes({
        page,
        page_size,
        contact_id,
      }),
    enabled: Boolean(contact_id),
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
