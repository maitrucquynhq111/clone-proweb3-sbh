import { useNetworkState } from 'react-use';
import { useEffect } from 'react';
import { useOfflineContext } from '../../context/OfflineContext';
import { RequestType } from '../../constants';
import { orderStore } from '../../stores';
import OfflineState from './OfflineState';
import OnlineState from './OnlineState';

const OfflineBar = () => {
  const { offlineModeWorker } = useOfflineContext();
  const { online } = useNetworkState();

  useEffect(() => {
    offlineModeWorker.postMessage({
      action: RequestType.GET_ALL_ORDER,
      value: null,
    });
    return () => {
      orderStore.setOrders([]);
    };
  }, []);

  return online ? <OnlineState /> : <OfflineState />;
};

export default OfflineBar;
