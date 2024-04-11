import { useCallback, useEffect, useMemo } from 'react';
import { RequestType } from '../constants';
import { PosFilter } from '../stores';
import { ACCESS_TOKEN_KEY, BUSINESS_KEY, API_URI } from '~app/configs';

export const useOfflineMode = ({ callbackFunc }: ExpectedAny) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY) || '';
  const bussiness = localStorage.getItem(BUSINESS_KEY) || '';

  const handleAction = useCallback((data: ExpectedAny) => {
    callbackFunc?.(data);
  }, []);

  const offlineModeWorker = useMemo(() => new Worker(new URL('~app/workers/web-worker.js', import.meta.url)), []);

  const initDb = useCallback(async () => {
    offlineModeWorker.postMessage({
      action: RequestType.INIT_DB,
      data: {
        token,
        bussiness,
        apiUrl: API_URI,
      },
    });
  }, [token, bussiness]);

  const synchData = useCallback(
    (filter: PosFilter) => {
      offlineModeWorker.postMessage({
        action: RequestType.SYNC_DATA,
        data: {
          token,
          bussiness,
          apiUrl: API_URI,
        },
        value: filter,
      });
    },
    [token, bussiness],
  );

  useEffect(() => {
    offlineModeWorker.onmessage = (e) => {
      handleAction(e.data);
      return (window as ExpectedAny).ViaReceiver.OnMessage(e.data);
    };

    (window as ExpectedAny).ViaReceiver.postMessage = (data: ExpectedAny) => offlineModeWorker.postMessage(data);
    return () => {
      offlineModeWorker.terminate();
    };
  }, []);

  return {
    initDb,
    synchData,
    offlineModeWorker,
  };
};
