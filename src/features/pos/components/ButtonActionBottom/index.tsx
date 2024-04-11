import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useNetworkState } from 'react-use';
import { useState, useMemo, useRef, useEffect, useSyncExternalStore } from 'react';
import { v4 } from 'uuid';
import { format } from 'date-fns';
import { PaymentSettingType, SyncType } from '~app/features/pos/constants';
import { useSelectedOrderStore, usePosStore } from '~app/features/pos/hooks';
import { OrderStatusType, CASH_PAYMENT_SOURCE } from '~app/utils/constants';
import { ID_EMPTY, RETAILCUSTOMER } from '~app/configs';
import { useResponseOrderStore } from '~app/features/pos/hooks/useResponseOrder';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';
import { useCreateOrderMutation, useUpdateOrderDetailMutation } from '~app/services/mutations';
import { usePaymentsInfo, useCacheMeQuery, KITCHEN_TICKETS } from '~app/services/queries';
import { queryClient } from '~app/configs/client';
import OfflineCreateOrderModal, {
  ModalRefObject,
} from '~app/features/pos/components/OrderPayment/OfflineCreateOrderModal';
import { paymentSourceStore } from '~app/features/pos/stores';
import { AuthService } from '~app/services/api';
import { toCreateOrderInput } from '~app/features/orders/utils';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import {
  formatOrderFastItem,
  getOrderGrandTotal,
  getOrderTotal,
  saveLocalPendingOrders,
  getLocalPendingOrders,
  createOrderPrinter,
  DeliveryMethodType,
} from '~app/features/pos/utils';
import { useKitchenPrinting, usePrinter } from '~app/utils/hooks';

type Props = {
  canChooseContact?: boolean;
  className?: string;
  classNameBtn?: string;
};

const ButtonActionBottom = ({ className, classNameBtn, canChooseContact = true }: Props) => {
  const { t } = useTranslation('pos');
  const { online } = useNetworkState();
  const {
    syncDataByTypes,
    setting: { invoice, pos },
  } = useOfflineContext();
  const { data: dataUser } = useCacheMeQuery();
  const { data: paymentsInfo } = usePaymentsInfo();
  const confirmCreateOrderOfflineRef = useRef<ModalRefObject>(null);
  const [confirmCreateOffline, setConfirmCreateOffline] = useState<boolean>(false);
  const [, setPosStore] = usePosStore((store) => store.pending_orders);
  const [selectedOrder, setSelectedOrderStore] = useSelectedOrderStore((store) => store);
  const [paymentSourceId, setStore] = useSelectedOrderStore((store) => store.payment_source_id);
  const [buyerInfo] = useSelectedOrderStore((store) => store.buyer_info);
  const [reservationInfo] = useSelectedOrderStore((store) => store.reservation_info);
  const [listOrderItem] = useSelectedOrderStore((store) => store.list_order_item);
  const [promotionDiscount] = useSelectedOrderStore((store) => store.promotion_discount);
  const [otherDiscount] = useSelectedOrderStore((store) => store.other_discount);
  const [deliveryFee] = useSelectedOrderStore((store) => store.delivery_fee);
  const [deliveryMethod] = useSelectedOrderStore((store) => store.delivery_method);
  const dataPaymentSource = useSyncExternalStore(paymentSourceStore.subscribe, paymentSourceStore.getSnapshot);
  const canPrint = useMemo(
    () =>
      !!(deliveryMethod === DeliveryMethodType.TABLE && reservationInfo) || deliveryMethod !== DeliveryMethodType.TABLE,
    [deliveryMethod, reservationInfo],
  );

  const [, setResponseOrder] = useResponseOrderStore((store) => store);
  const { mutateAsync: createOrder } = useCreateOrderMutation();
  const { mutateAsync: updateOrderDetail } = useUpdateOrderDetailMutation();
  const { handlePrint: handlePrintKitchen, showDataPrint } = useKitchenPrinting({
    orderInfo: selectedOrder,
    note: selectedOrder.note,
    reservationInfo: reservationInfo,
  });
  const orderPrinter = createOrderPrinter({
    promotionDiscount,
    businessId: AuthService.getBusinessId() || '',
    order: { ...selectedOrder, reservation_meta: selectedOrder.reservation_info } || {},
    otherDiscount,
    customerPoint: selectedOrder.is_customer_point ? selectedOrder.customer_point_discount : 0,
    deliveryFee,
    customerPointDiscount: selectedOrder.is_customer_point ? selectedOrder.customer_point_discount : 0,
    validPromotion: !!selectedOrder.valid_promotion,
  });

  const {
    handlePrint: handlePrintInvoice,
    showDataPrint: showDataPrintInvoice,
    setDebtAmount,
  } = usePrinter({
    ordersPrint: [orderPrinter],
    configs: invoice,
    paymentsInfo,
    businessInfo: dataUser?.business_info.current_business,
  });

  useEffect(() => {
    if (buyerInfo.name) {
      setDebtAmount([
        {
          id: '',
          amount: buyerInfo.debt_amount || 0,
        },
      ]);
    }
  }, [buyerInfo]);

  const memoizedDataPaymentSource = useMemo(() => {
    if (dataPaymentSource) return dataPaymentSource;
    return [] as Array<Payment>;
  }, [dataPaymentSource]);

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
    if (paymentSourceId) return;
    const cashPaymentSource = memoizedDataPaymentSource.find((item) => item.name === CASH_PAYMENT_SOURCE);
    if (!cashPaymentSource) return;
    setStore((store) => ({
      ...store,
      payment_source_id: cashPaymentSource.id,
      payment_source_name: cashPaymentSource.name,
    }));
  }, [memoizedDataPaymentSource, selectedOrder]);

  const handleClick = (value: PaymentSettingType) => {
    // Promotion
    if (value === PaymentSettingType.PROMOTION) {
      return setPosStore((store) => ({ ...store, show_promotion_modal: true }));
    }
    // Other discount
    if (value === PaymentSettingType.OTHER_DISCOUNT) {
      return setPosStore((store) => ({ ...store, show_other_discount_modal: true }));
    }
    // Delivery fee
    if (value === PaymentSettingType.DELIVERY_FEE) {
      return setPosStore((store) => ({ ...store, show_delivery_fee_modal: true }));
    }
    // Note
    if (value === PaymentSettingType.NOTE) {
      return setPosStore((store) => ({ ...store, show_note_modal: true }));
    }
    // Customer
    if (value === PaymentSettingType.CUSTOMER) {
      return setPosStore((store) => ({ ...store, show_customer_modal: true }));
    }
  };
  const createOrUpdateOrder = async () => {
    try {
      const business_id = await AuthService.getBusinessId();
      if (listOrderItem.length === 0) {
        toast.error(t('error.empty_order_item'));
        return false;
      }
      // Save order before print kitchen
      const { id, ...newSelectedOrder } = selectedOrder;
      const data: PendingOrderForm = { ...newSelectedOrder };
      const isUpdateOrder = !!data.created_order_at;
      data.ordered_grand_total = orderTotal;
      data.grand_total = grandTotal;
      data.is_open_delivery = true;
      data.debit = {
        ...data.debit,
        buyer_pay: 0,
        is_debit: false,
      };

      if (!data.buyer_info.name) {
        data.buyer_info.name = RETAILCUSTOMER.name;
        data.buyer_info.phone_number = RETAILCUSTOMER.phone_number;
      }

      const list_order_item: PendingOrderItem[] = [];
      const list_product_fast: FastProduct[] = [];
      const orderItemsLength = data.list_order_item.filter((item) => item.product_id !== ID_EMPTY).length;
      data.list_order_item.filter((item, index) => {
        const { id, can_pick_quantity, ...newItem } = item as PendingOrderItem;
        if (item.product_id !== ID_EMPTY || item.sku_id) {
          list_order_item.push(newItem);
        } else {
          const product_id = `fast_${index + 1}`;
          const productFast = {
            ...formatOrderFastItem(newItem),
            business_id: business_id || '',
            priority: orderItemsLength + index,
          };
          if (isUpdateOrder) {
            Object.assign(productFast, { product_id });
          }
          list_product_fast.push(productFast);
        }
      });

      if (list_product_fast.length > 0) {
        data.list_product_fast = list_product_fast;
      }
      data.list_order_item = list_order_item;
      data.customer_point = data.is_customer_point ? data.customer_point_discount : 0;
      data.customer_point_discount = data.is_customer_point ? data.customer_point_discount : 0;
      data.state = OrderStatusType.DELIVERING;
      if (!online) {
        const offlineOrderData = {
          id: v4(),
          created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS+07:00"),
          ...data,
        };
        setConfirmCreateOffline(true);
        setTimeout(() => {
          offlineOrderData && confirmCreateOrderOfflineRef?.current?.setOfflineOrder(offlineOrderData);
        }, 500);
      } else {
        let response = null;
        // update order if edit order from table
        if (isUpdateOrder) {
          const body = toCreateOrderInput(selectedOrder);
          body.ordered_grand_total = orderTotal;
          body.grand_total = grandTotal;
          body.created_at = data?.created_order_at || '';
          body.amount_paid = data.debit.buyer_pay;
          body.reservation_info = data.reservation_info;
          body.list_order_item = data.list_order_item;
          body.list_product_fast = data.list_product_fast;
          response = await updateOrderDetail({ id: id || '', body });
          if (response?.status) {
            setResponseOrder(response);
            return false;
          }
        }
        // create order
        if (!isUpdateOrder) {
          response = await createOrder(data);
          if (response?.status) {
            setResponseOrder(response);
            return false;
          }
          const orders = getLocalPendingOrders();
          const newPendingOrder = {
            ...selectedOrder,
            id: response?.id,
            order_number: response?.order_number,
            created_order_at: response?.created_order_at,
          };
          setSelectedOrderStore(() => newPendingOrder);
          setPosStore((store) => {
            const newPendingOrders = removeDuplicates([...orders, newPendingOrder], 'id');
            saveLocalPendingOrders(newPendingOrders, newPendingOrder.id || '');
            return { ...store, pending_orders: newPendingOrders };
          });
        }
        if (response) {
          queryClient.invalidateQueries([KITCHEN_TICKETS, { order_id: response?.id }], { exact: false });
          syncDataByTypes([SyncType.CONTACTS, SyncType.PRODUCTS]);
          return true;
        }
      }
    } catch (error) {
      //  TO DO
      return false;
    }
  };

  const submitPrintKitchen = async () => {
    const resCreateOrUpdate = await createOrUpdateOrder();
    if (resCreateOrUpdate) {
      handlePrintKitchen();
    }
  };

  if (listOrderItem.length === 0) return null;

  return (
    <div className={cx('pw-flex pw-items-start pw-gap-x-2 pw-py-3 pw-px-6 pw-whitespace-normal', className)}>
      {canChooseContact && (
        <button
          className={cx(
            'pw-w-full pw-h-full pw-px-3 pw-py-5 pw-text-blue-primary pw-bg-secondary-background pw-font-bold pw-rounded pw-text-center pw-text-base',
            classNameBtn,
          )}
          onClick={() => handleClick(PaymentSettingType.CUSTOMER)}
        >
          {t('action.contact')}
        </button>
      )}
      <button
        className={cx(
          'pw-w-full pw-h-full pw-px-3 pw-py-5 pw-text-blue-primary pw-bg-secondary-background pw-font-bold pw-rounded pw-text-center pw-text-base',
          classNameBtn,
        )}
        onClick={() => handleClick(PaymentSettingType.OTHER_DISCOUNT)}
      >
        {t('other_discount')}
      </button>
      <button
        className={cx(
          'pw-w-full pw-h-full pw-px-3 pw-py-5 pw-text-blue-primary pw-bg-secondary-background pw-font-bold pw-rounded pw-text-center pw-text-base',
          classNameBtn,
        )}
        onClick={() => handleClick(PaymentSettingType.DELIVERY_FEE)}
      >
        {t('delivery')}
      </button>
      <button
        className={cx(
          'pw-w-full pw-h-full pw-px-3 pw-py-5 pw-text-blue-primary pw-bg-secondary-background pw-font-bold pw-rounded pw-text-center pw-text-base',
          classNameBtn,
        )}
        onClick={() => handleClick(PaymentSettingType.NOTE)}
      >
        {t('note')}
      </button>
      <button
        className={cx(
          'pw-w-full pw-h-full pw-px-3 pw-py-5 pw-text-blue-primary pw-bg-secondary-background pw-font-bold pw-rounded pw-text-center pw-text-base',
          classNameBtn,
        )}
        onClick={() => {
          if (!online) return toast.warning(t('error.no_network_promotion'));
          handleClick(PaymentSettingType.PROMOTION);
        }}
      >
        {t('promotion')}
      </button>
      <button
        className={cx(
          'pw-w-full pw-h-full pw-px-3 pw-py-5 pw-text-blue-primary pw-bg-secondary-background pw-font-bold pw-rounded pw-text-center pw-text-base',
          classNameBtn,
        )}
        onClick={() => {
          if (!canPrint) return toast.error(t('error.not_select_table_for_print'));
          handlePrintInvoice();
        }}
      >
        {t('action.print_order_temp')}
      </button>
      {pos.kitchen_printing && (
        <button
          className={cx(
            'pw-w-full pw-h-full pw-px-3 pw-py-5 pw-text-blue-primary pw-bg-secondary-background pw-font-bold pw-rounded pw-text-center pw-text-base',
            classNameBtn,
          )}
          onClick={submitPrintKitchen}
        >
          {t('action.print_kitchen')}
        </button>
      )}
      <div className="pw-hidden">{showDataPrint()}</div>
      <div className="pw-hidden">{showDataPrintInvoice()}</div>
      {confirmCreateOffline && (
        <OfflineCreateOrderModal
          ref={confirmCreateOrderOfflineRef}
          open={confirmCreateOffline}
          onClose={() => setConfirmCreateOffline(false)}
        />
      )}
    </div>
  );
};

export default ButtonActionBottom;
