import cx from 'classnames';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DeliveryFeeInput, OrderNoteInput, OtherDiscountInput } from '~app/features/pos/components';
import Promotion from '~app/features/pos/components/OrderPayment/Promotion';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { formatCurrency } from '~app/utils/helpers';

type Props = {
  className?: string;
  orderedGrandTotal: number;
};

const OrderInfo = ({ className, orderedGrandTotal }: Props) => {
  const { t } = useTranslation('orders-form');
  const [selectedOrder] = useSelectedOrderStore((store) => store);

  const totalItem = useMemo(() => {
    return selectedOrder.list_order_item.reduce((prev, cur) => {
      return prev + cur.quantity;
    }, 0);
  }, [selectedOrder.list_order_item]);

  return (
    <div className={cx('pw-py-4 pw-px-6 pw-bg-neutral-white', className)}>
      <h3 className="pw-font-bold pw-text-base pw-text-neutral-primary">{t('order_info')}</h3>
      <div className="pw-flex pw-justify-between pw-mt-5">
        <span className="pw-text-base pw-text-neutral-primary">
          {t('count_product_in_order', { count: totalItem })}
        </span>
        <span className="pw-text-base pw-text-neutral-primary pw-font-semibold">
          {formatCurrency(orderedGrandTotal)}₫
        </span>
      </div>
      {selectedOrder.promotion_code && <Promotion />}
      <OtherDiscountInput
        orderTotal={orderedGrandTotal}
        promotionDiscount={selectedOrder.valid_promotion ? selectedOrder.promotion_discount : 0}
        className="pw-mt-3"
      />
      <DeliveryFeeInput className="pw-mt-3" />
      <OrderNoteInput className="pw-mt-3" />
    </div>
  );
};

export default OrderInfo;
