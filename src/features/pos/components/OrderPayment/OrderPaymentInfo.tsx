import { useEffect, useMemo } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import CustomerPoint from './CustomerPoint';
import Promotion from './Promotion';
import PaymentInfo from '~app/features/pos/components/OrderPayment/PaymentInfo';
import { formatCurrency } from '~app/utils/helpers';
import { DeliveryFeeInput, OrderNoteInput, OtherDiscountInput } from '~app/features/pos/components';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';
import { checkValidPromotion, getOrderGrandTotal, getOrderTotal } from '~app/features/pos/utils';
import { RETAILCUSTOMER } from '~app/configs';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';

type Props = {
  className?: string;
  canCompletePayment?: boolean; // if true => can complete payment when click "Payment", is false => open CompletePayment modal
};

const OrderPaymentInfo = ({ className = '', canCompletePayment = false }: Props) => {
  const { t } = useTranslation('pos');
  const {
    setting: { bussiness },
  } = useOfflineContext();
  const [selectedOrder, setSelectedOrderStore] = useSelectedOrderStore((store) => store);
  const [listOrderItem] = useSelectedOrderStore((store) => store.list_order_item);
  const [buyerInfo] = useSelectedOrderStore((store) => store.buyer_info);
  const [promotionDiscount] = useSelectedOrderStore((store) => store.promotion_discount);
  const [promotionCode] = useSelectedOrderStore((store) => store.promotion_code);
  const [otherDiscount] = useSelectedOrderStore((store) => store.other_discount);
  const [customerPoint] = useSelectedOrderStore((store) => store.customer_point);
  const [deliveryFee] = useSelectedOrderStore((store) => store.delivery_fee);

  const orderTotal = useMemo(() => {
    const total = getOrderTotal(listOrderItem);
    return total;
  }, [listOrderItem]);
  const grandTotal = useMemo(
    () =>
      getOrderGrandTotal({
        orderTotal,
        promotionDiscount,
        otherDiscount,
        deliveryFee,
        customerPointDiscount: selectedOrder.is_customer_point ? selectedOrder.customer_point_discount : 0,
        validPromotion: selectedOrder.valid_promotion,
      }),
    [orderTotal, promotionDiscount, otherDiscount, deliveryFee, selectedOrder],
  );

  useEffect(() => {
    // auto change customer point when change order price
    const maxDiscount = orderTotal <= customerPoint ? orderTotal : customerPoint;
    setSelectedOrderStore((prevState) => {
      if (prevState.created_order_at) return prevState;
      return {
        ...prevState,
        customer_point_discount: orderTotal <= maxDiscount ? orderTotal : maxDiscount,
      };
    });
  }, [orderTotal, customerPoint, buyerInfo]);

  useEffect(() => {
    // check valid promotion when change order price
    setSelectedOrderStore((prevState) => {
      const selectedPromotion = prevState.selected_promotion;
      if (!selectedPromotion) return prevState;
      const validPromotion = checkValidPromotion({ promotion: selectedPromotion || null, orderTotal });
      return {
        ...prevState,
        valid_promotion: validPromotion,
        selected_promotion: { ...selectedPromotion, valid: validPromotion },
      };
    });
  }, [orderTotal]);

  return (
    <div className={cx('pw-p-3 pw-border-t-4 pw-border-t-neutral-background pw-bg-white pw-w-full', className)}>
      {listOrderItem.length > 0 && (
        <div className="pw-flex pw-justify-between pw-items-center">
          <span className="pw-font-normal pw-text-sm pw-text-neutral-primary">
            {t('total_products', { totalProducts: listOrderItem.length })}
          </span>
          <div className="pw-flex pw-items-center pw-gap-x-2">
            {/* {orderTotal > grandTotal ? (
              <span className="pw-text-sm pw-text-neutral-placeholder pw-line-through">
                {formatCurrency(orderTotal)}
              </span>
            ) : null} */}
            <span className="pw-text-neutral-primary pw-text-base pw-font-semibold">{formatCurrency(orderTotal)}</span>
          </div>
        </div>
      )}
      <div>
        {bussiness?.is_customer_point &&
          (buyerInfo?.phone_number || buyerInfo?.name) &&
          buyerInfo?.phone_number !== RETAILCUSTOMER.phone_number && <CustomerPoint orderTotal={orderTotal} />}
        <OtherDiscountInput
          orderTotal={orderTotal}
          promotionDiscount={selectedOrder.valid_promotion ? promotionDiscount : 0}
          className="pw-mt-3"
        />
        <DeliveryFeeInput className="pw-mt-3" />
        {promotionCode && <Promotion />}
        <OrderNoteInput className="pw-mt-3" />
      </div>
      {canCompletePayment && (
        <PaymentInfo
          className="pw-pt-2 pw-border-t pw-border-neutral-divider pw-mt-4"
          orderTotal={orderTotal}
          grandTotal={grandTotal}
        />
      )}
    </div>
  );
};

export default OrderPaymentInfo;
