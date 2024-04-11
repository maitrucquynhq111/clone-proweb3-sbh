import { useQuery } from '@tanstack/react-query';
import { AuthService, ProductService } from '~app/services/api';

const CATEGORIES_KEY = 'categories';

type Props = {
  page: number;
  page_size: number;
  name: string;
};

export const useCategoriesQuery = ({ page, page_size, name }: Props) => {
  const business_id = AuthService.getBusinessId();
  const queryKey = [
    CATEGORIES_KEY,
    {
      page,
      page_size,
      name,
      business_id,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: Category[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ProductService.getCategories({
        page,
        page_size,
        name,
      }),
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
