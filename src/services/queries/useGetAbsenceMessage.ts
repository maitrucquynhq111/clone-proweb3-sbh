import { useQuery } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const ABSENCE_MESSAGE_KEY = 'absence_message';

export const useGetAbsenceMessage = ({ business_has_page_id }: AbsenceMessageParams) => {
  const { isLoading, error, data, isError, isFetching, isLoadingError } = useQuery<AbsenceMessageResponse, Error>({
    queryKey: [ABSENCE_MESSAGE_KEY, { business_has_page_id }],
    queryFn: () => ChatService.getAbsenceMessage({ business_has_page_id }),
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!business_has_page_id,
  });

  return {
    isLoadingError,
    isFetching,
    isLoading,
    isError,
    error,
    data: data
      ? {
          absent_schedule: data.absent_schedule,
          absent_message: data.business_has_page_with_absent_msg.page_absent_message,
        }
      : null,
  };
};
