import { memo, useMemo, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Tag } from 'rsuite';
import HistoryTable from './HistoryTable';
import PaymentForm from './PaymentForm';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import { formatCurrency } from '~app/utils/helpers';
import { getOrderGrandTotal, getOrderTotal } from '~app/features/pos/utils';
import { OrderStatusType } from '~app/utils/constants';
import { OrderPermission, useHasPermissions } from '~app/utils/shield';

const PaymentHistory = () => {
  const { t } = useTranslation('orders-form');
  const [isEdit] = usePosStore((store) => store.is_edit_order);
  const [selectedOrder] = useSelectedOrderStore((store) => store);
  const [buyerPay] = useSelectedOrderStore((store) => store.debit.buyer_pay);
  const canPayDebt = useHasPermissions([OrderPermission.ORDER_ORDERDETAIL_DEBT_VIEW]);

  const orderTotal = useMemo(() => {
    const total = getOrderTotal(selectedOrder.list_order_item);
    return total;
  }, [selectedOrder.list_order_item]);
  const grandTotal = useMemo(
    () =>
      getOrderGrandTotal({
        orderTotal,
        promotionDiscount: selectedOrder.promotion_discount,
        otherDiscount: selectedOrder.other_discount,
        deliveryFee: selectedOrder.delivery_fee,
        customerPointDiscount: selectedOrder.is_customer_point ? selectedOrder.customer_point_discount : 0,
        validPromotion: true,
      }),
    [orderTotal, selectedOrder],
  );
  const debtAmount = useMemo(() => grandTotal - buyerPay, [grandTotal, buyerPay]);
  const showPayButton = useMemo(() => {
    if (selectedOrder.state === OrderStatusType.DELIVERING || selectedOrder.state === OrderStatusType.COMPLETE)
      return true;
    return false;
  }, [selectedOrder]);

  const [openPayment, setOpenPayment] = useState(false);

  return (
    <div>
      <Tag
        className={cx('!pw-text-white !pw-font-semibold pw-rounded-md pw-mb-2', {
          '!pw-bg-amber-600': debtAmount > 0,
          '!pw-bg-error-active': debtAmount <= 0,
        })}
      >
        {debtAmount > 0 ? t('contact_debt') : t('paid')}
      </Tag>
      {debtAmount > 0 && showPayButton && (
        <div className="pw-flex pw-items-center pw-justify-between">
          <h3 className="pw-text-secondary-main">{formatCurrency(debtAmount)}₫</h3>
          {canPayDebt && !openPayment && (
            <Button
              appearance="primary"
              className="!pw-text-base !pw-font-bold !pw-py-3 !pw-px-4"
              disabled={isEdit}
              onClick={() => setOpenPayment(true)}
            >
              {t('action.pay')}
            </Button>
          )}
        </div>
      )}
      {openPayment && !isEdit ? <PaymentForm debtAmount={debtAmount} onClose={() => setOpenPayment(false)} /> : null}
      <HistoryTable />
      <div className="pw-flex pw-items-center pw-justify-between pw-mt-4 pw-text-base">
        <div>{t('contact_paid_amount')}</div>
        <div className="pw-font-semibold">{formatCurrency(buyerPay)}₫</div>
      </div>
    </div>
  );
};

export default memo(PaymentHistory);
