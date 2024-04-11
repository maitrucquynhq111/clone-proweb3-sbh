import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { columnsConfig } from './config';
import { StaticTable } from '~app/components';
import { useSelectedOrderStore } from '~app/features/pos/hooks';

const RefundOrderTable = () => {
  const { t } = useTranslation('orders-form');
  const [refundOrders] = useSelectedOrderStore((store) => store.refund_order);
  const [isFullReturn] = useSelectedOrderStore((store) => store.is_full_return);

  if (!refundOrders || refundOrders?.length === 0) return null;

  return (
    <div className="pw-p-4 pw-bg-neutral-white pw-mt-6">
      <div className="pw-flex pw-justify-between pw-mb-4">
        <h4 className="pw-text-base pw-font-bold pw-tracking-tighter">
          {isFullReturn ? t('full_return') : t('partial_return')}
        </h4>
      </div>
      <StaticTable columnConfig={columnsConfig({ t })} data={refundOrders || []} rowKey="id" />
    </div>
  );
};

export default memo(RefundOrderTable);
