import { useQuery } from '@tanstack/react-query';
import { TableService } from '~app/services/api';

export const KITCHEN_TICKETS = 'kitchen-tickets';

export const useGetListKitchenTickets = ({ order_id }: { order_id: string }) => {
  const queryKey = [KITCHEN_TICKETS, { order_id }];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: KitchenTicket },
    Error
  >({
    queryKey,
    queryFn: () => TableService.getKitchenTickets({ order_id }),
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
