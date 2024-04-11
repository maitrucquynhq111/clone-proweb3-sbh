import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { StaticTable } from '~app/components';
import { paymentHistoryColumnsConfig } from '~app/features/orders/details/config';

const HistoryTable = () => {
  const { t } = useTranslation('orders-form');
  const [paymentOrderHistory] = useSelectedOrderStore((store) => store.payment_order_history);

  if (paymentOrderHistory?.length === 0) return null;

  return (
    <StaticTable
      className="pw-mt-4"
      columnConfig={paymentHistoryColumnsConfig({ t })}
      data={paymentOrderHistory || []}
      rowKey="id"
    />
  );
};

export default memo(HistoryTable);
