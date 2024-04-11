import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { handleLogin } from '~app/utils/helpers';

const onError = (error: ExpectedAny, query: ExpectedAny) => {
  if (error.message === 'unauthorized') {
    handleLogin();
  } else {
    if (!query?.meta?.ignoreError) {
      toast.error(error.message);
    }
  }
};

const queryCache: ExpectedAny = new QueryCache({
  onError,
});

const mutationCache: ExpectedAny = new MutationCache({
  onError,
});

export const queryClient: QueryClient = new QueryClient({
  queryCache,
  mutationCache,
});
