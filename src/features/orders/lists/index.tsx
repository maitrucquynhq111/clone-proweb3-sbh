import { useSearchParams } from 'react-router-dom';
import OnlineOrders from './OnlineOrders';
import OfflineOrders from './OfflineOrders';

const OrderList = () => {
  const [searchParams] = useSearchParams();
  const isOffline = searchParams.get('mode') === 'offline';
  return isOffline ? <OfflineOrders /> : <OnlineOrders />;
};

export default OrderList;
