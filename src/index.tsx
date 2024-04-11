import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer, Slide } from 'react-toastify';
import registerServiceWorker from './serviceWorkerRegistration';
import App from './App';
import { excludesPersistedKeys } from '~app/services/configs';
import { queryClient } from '~app/configs/client';
import { ErrorBoundary } from '~app/components';

const rootElement = document.getElementById('root') as Element;
const root = createRoot(rootElement);

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

root.render(
  <>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const queryIsReadyForPersistance = query.state.status === 'success';
            if (queryIsReadyForPersistance) {
              const { queryKey } = query;
              const excludeFromPersisting = queryKey.some((r) => excludesPersistedKeys.includes(r));
              return !excludeFromPersisting;
            }
            return queryIsReadyForPersistance;
          },
        },
      }}
      onSuccess={() => {
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }}
    >
      <QueryClientProvider client={queryClient}>
        {(process.env.NODE_ENV === 'development' && (
          <>
            <Router>
              <App />
            </Router>
            <ReactQueryDevtools initialIsOpen={false} />
            <ToastContainer position="bottom-right" transition={Slide} autoClose={2500} hideProgressBar={true} />
          </>
        )) || (
          <ErrorBoundary>
            <Router>
              <App />
            </Router>
            <ToastContainer position="bottom-right" transition={Slide} autoClose={2500} hideProgressBar={true} />
          </ErrorBoundary>
        )}
      </QueryClientProvider>
    </PersistQueryClientProvider>
  </>,
);
if (process.env.NODE_ENV !== 'development') {
  registerServiceWorker();
}
