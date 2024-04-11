import cx from 'classnames';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import OtherDiscount from './OtherDiscount';
import Promotion from './Promotion';
import DeliveryFee from './DeliveryFee';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import { getOrderGrandTotal, getOrderTotal } from '~app/features/pos/utils';
import { formatCurrency } from '~app/utils/helpers';
import { RefundStatusType } from '~app/utils/constants';

const OrderSummary = () => {
  const { t } = useTranslation('orders-form');
  const [isCreate] = usePosStore((store) => store.is_create_order);
  const [selectedOrder] = useSelectedOrderStore((store) => store);

  const orderTotal = useMemo(() => {
    const total = getOrderTotal(selectedOrder.list_order_item);
    return total;
  }, [selectedOrder.list_order_item]);

  const orderGrandTotal = useMemo(
    () =>
      getOrderGrandTotal({
        orderTotal,
        promotionDiscount: selectedOrder.promotion_discount,
        otherDiscount: selectedOrder.other_discount,
        deliveryFee: selectedOrder.delivery_fee,
        customerPointDiscount: selectedOrder.is_customer_point ? selectedOrder.customer_point_discount : 0,
        validPromotion: isCreate ? selectedOrder.valid_promotion : true,
      }),
    [orderTotal, selectedOrder],
  );

  const refundStatus = useMemo(() => {
    return selectedOrder?.canceled_order_info?.refund_status || '';
  }, [selectedOrder]);

  return (
    <div className="pw-flex pw-flex-col pw-gap-y-2">
      <div className="pw-flex pw-justify-between pw-items-center">
        <h4 className="pw-text-base pw-text-neutral-primary pw-font-normal">
          {t('total_short')} {selectedOrder.list_order_item.length} {t('product').toLowerCase()}
        </h4>
        <span className="pw-text-base pw-text-neutral-primary pw-font-semibold">{formatCurrency(orderTotal)}₫</span>
      </div>
      <OtherDiscount orderTotal={orderTotal} />
      <Promotion orderGrandTotal={orderGrandTotal} />
      <DeliveryFee />
      <div className="pw-my-1 pw-w-full pw-border-b pw-border-solid pw-border-neutral-divider" />
      {!isCreate && selectedOrder.customer_point_discount > 0 ? (
        <div className="pw-flex pw-justify-between pw-items-center">
          <h4 className="pw-text-base pw-text-neutral-primary pw-font-normal">{t('from_customer_point')}</h4>
          <span className="pw-text-base pw-text-neutral-primary pw-font-semibold">
            {formatCurrency(selectedOrder.customer_point_discount)}₫
          </span>
        </div>
      ) : null}
      <div className="pw-flex pw-justify-between pw-items-center">
        <h4 className="pw-text-base pw-text-neutral-primary pw-font-normal">{t('grand_total')}</h4>
        <span className="pw-text-base pw-text-secondary-main pw-font-bold">{formatCurrency(orderGrandTotal)}₫</span>
      </div>
      {refundStatus ? (
        <div
          className={cx('pw-text-right -pw-mt-1 pw-text-base', {
            'pw-text-success-active': refundStatus === RefundStatusType.REFUNDED,
            'pw-text-error-active': refundStatus === RefundStatusType.NON_REFUND,
            'pw-text-warning-active': refundStatus === RefundStatusType.PARTIAL_REFUND,
          })}
        >
          {t(refundStatus)}
        </div>
      ) : null}
    </div>
  );
};

export default memo(OrderSummary);
