import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { formatCurrency } from '~app/utils/helpers';

const RefundOrderSummary = () => {
  const { t } = useTranslation('orders-form');
  const [listOrderitem] = useSelectedOrderStore((store) => store.list_order_item);
  const [grandTotal] = useSelectedOrderStore((store) => store.grand_total);
  return (
    <div className="pw-flex pw-flex-col">
      <div className="pw-flex pw-justify-between pw-items-center">
        <h4 className="pw-text-base pw-text-neutral-primary pw-font-normal">
          {t('total_pay_buyer')} ({listOrderitem.length} {t('product').toLowerCase()})
        </h4>
        <span className="pw-text-base pw-text-secondary-main pw-font-bold">{formatCurrency(grandTotal)}₫</span>
      </div>
    </div>
  );
};

export default memo(RefundOrderSummary);
