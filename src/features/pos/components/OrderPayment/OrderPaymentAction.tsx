import { useTranslation } from 'react-i18next';
import { BsClockHistory } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { OrderStatusType } from '~app/utils/constants';
import { formatCurrency } from '~app/utils/helpers';
import {
  DeliveryMethodType,
  saveLocalPendingOrders,
  initialOrder,
  getOrderGrandTotal,
  getOrderTotal,
} from '~app/features/pos/utils';
import { PosMode } from '~app/features/pos/constants';
import { useSelectedOrderStore, usePosStore } from '~app/features/pos/hooks';
import { MainRouteKeys } from '~app/routes/enums';
import { OrderPermission, useHasPermissions } from '~app/utils/shield';

type Props = {
  onPayment(state: OrderStatusType, isOnDelivery: boolean, cbSuccess?: () => void): void;
  openHistoryOrder(): void;
  openCompletePayment(): void;
  isKitchenPrinting?: boolean;
  canCompletePayment?: boolean; // if true => can complete payment when click "Payment", is false => open CompletePayment modal
};

type ActionProps = {
  grandTotal: number;
  posMode: string;
  canSaveOrder: boolean;
  canCompleteOrder: boolean;
} & Props;

const FnbTableAction = ({
  onPayment,
  openHistoryOrder,
  openCompletePayment,
  grandTotal,
  isKitchenPrinting,
  canCompletePayment,
  posMode,
  canSaveOrder,
  canCompleteOrder,
}: ActionProps) => {
  const { t } = useTranslation('pos');
  const navigate = useNavigate();
  const [pendingOrders, setPosStore] = usePosStore((store) => store.pending_orders);
  const [selectedOrder, setSelectedOrderStore] = useSelectedOrderStore((store) => store);

  const saveOrderInTable = () => {
    onPayment(OrderStatusType.DELIVERING, true, navigateTableManagement);
  };

  const paymentOrder = () => {
    if (canCompletePayment) return onPayment(OrderStatusType.COMPLETE, false, navigateTableManagement);
    openCompletePayment();
  };

  const navigateTableManagement = () => {
    if (pendingOrders.length > 1) {
      const newPendingOrders = pendingOrders.filter((order) => order.id !== selectedOrder?.id);
      setPosStore((store) => {
        saveLocalPendingOrders(newPendingOrders, selectedOrder?.id || '');
        return { ...store, pending_orders: newPendingOrders };
      });
      const newPendingOrder = newPendingOrders[0];
      if (!newPendingOrder) return { ...initialOrder() };
      setSelectedOrderStore(() => newPendingOrder);
    } else {
      const newPendingOrder = initialOrder();
      setPosStore((store) => {
        const newPendingOrders = [newPendingOrder];
        saveLocalPendingOrders(newPendingOrders, selectedOrder?.id || '');
        return { ...store, pending_orders: newPendingOrders };
      });
      setSelectedOrderStore(() => newPendingOrder);
    }
    navigate(MainRouteKeys.Table);
  };
  return (
    <>
      <div className="pw-flex pw-w-full pw-gap-x-2">
        {isKitchenPrinting && (
          <button
            onClick={() => {
              openHistoryOrder();
            }}
            className="pw-flex pw-items-center pw-justify-center pw-p-5 pw-font-bold pw-text-base pw-text-neutral-primary pw-rounded pw-text-center pw-border pw-border-solid pw-border-blue-primary"
          >
            <BsClockHistory size={24} className="pw-text-blue-primary" />
          </button>
        )}
        {canSaveOrder && (
          <button
            onClick={() => saveOrderInTable()}
            className="pw-w-full pw-p-5 pw-bg-blue-primary pw-text-white pw-font-bold pw-rounded pw-text-center pw-text-base"
          >
            {t('action.save_order')}
          </button>
        )}
        {canCompleteOrder && (
          <button
            onClick={() => paymentOrder()}
            className="pw-w-full pw-p-2 pw-bg-green-700 pw-text-white pw-font-bold pw-rounded pw-text-center pw-text-sm"
          >
            {t('action.pay_order')} <br />
            {posMode === PosMode.FNB && <b>{formatCurrency(grandTotal)}đ</b>}
          </button>
        )}
      </div>
    </>
  );
};

const FnbAction = ({
  grandTotal,
  onPayment,
  openHistoryOrder,
  openCompletePayment,
  isKitchenPrinting,
  canCompletePayment,
  posMode,
  canSaveOrder,
  canCompleteOrder,
}: ActionProps) => {
  const { t } = useTranslation('pos');
  const saveOrderInTable = () => {
    onPayment(OrderStatusType.DELIVERING, true);
  };

  const paymentOrder = () => {
    if (canCompletePayment) return onPayment(OrderStatusType.COMPLETE, false);
    openCompletePayment();
  };

  return (
    <>
      <div className="pw-flex pw-w-full pw-gap-x-2">
        {isKitchenPrinting && (
          <button
            onClick={() => {
              openHistoryOrder();
            }}
            className="pw-flex pw-items-center pw-justify-center pw-p-5 pw-font-bold pw-text-base pw-text-neutral-primary pw-rounded pw-text-center pw-border pw-border-solid pw-border-blue-primary"
          >
            <BsClockHistory size={24} className="pw-text-blue-primary" />
          </button>
        )}
        {canSaveOrder && (
          <button
            onClick={() => saveOrderInTable()}
            className="pw-w-full pw-p-5 pw-bg-blue-primary pw-text-white pw-font-bold pw-rounded pw-text-center pw-text-base"
          >
            {t('action.save_order')}
          </button>
        )}
        {canCompleteOrder && (
          <button
            onClick={() => paymentOrder()}
            className="pw-w-full pw-p-2 pw-bg-green-700 pw-text-white pw-font-semibold pw-rounded pw-text-center pw-text-sm"
          >
            {t('action.pay_order')} <br />
            {posMode === PosMode.FNB && <b>{formatCurrency(grandTotal)}đ</b>}
          </button>
        )}
      </div>
    </>
  );
};

const OrderPaymentAction = ({
  onPayment,
  openHistoryOrder,
  openCompletePayment,
  isKitchenPrinting,
  canCompletePayment,
}: Props) => {
  const [listOrderItem] = useSelectedOrderStore((store) => store.list_order_item);
  const [reservationInfo] = useSelectedOrderStore((store) => store.reservation_info);
  const [deliveryMethod] = useSelectedOrderStore((store) => store.delivery_method);
  const [selectedOrder] = useSelectedOrderStore((store) => store);
  const [promotionDiscount] = useSelectedOrderStore((store) => store.promotion_discount);
  const [otherDiscount] = useSelectedOrderStore((store) => store.other_discount);
  const [deliveryFee] = useSelectedOrderStore((store) => store.delivery_fee);
  const [posMode] = usePosStore((store) => store.pos_mode);
  const canSaveOrder = useHasPermissions([OrderPermission.ORDER_CART_CREATE]);
  const canCompleteOrder = useHasPermissions([OrderPermission.ORDER_CART_COMPLETE]);

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

  return (
    <div className="pw-mt-2 pw-shadow-dropdown pw-py-3 pw-px-6">
      {deliveryMethod === DeliveryMethodType.TABLE && reservationInfo ? (
        <FnbTableAction
          grandTotal={grandTotal}
          onPayment={onPayment}
          openHistoryOrder={openHistoryOrder}
          openCompletePayment={openCompletePayment}
          isKitchenPrinting={isKitchenPrinting}
          canCompletePayment={canCompletePayment}
          posMode={posMode}
          canSaveOrder={canSaveOrder}
          canCompleteOrder={canCompleteOrder}
        />
      ) : (
        <FnbAction
          grandTotal={grandTotal}
          onPayment={onPayment}
          openHistoryOrder={openHistoryOrder}
          openCompletePayment={openCompletePayment}
          isKitchenPrinting={isKitchenPrinting}
          canCompletePayment={canCompletePayment}
          posMode={posMode}
          canSaveOrder={canSaveOrder}
          canCompleteOrder={canCompleteOrder}
        />
      )}
    </div>
  );
};

export default OrderPaymentAction;
