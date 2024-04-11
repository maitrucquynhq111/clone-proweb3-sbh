import { toast } from 'react-toastify';
import { useEffect, useMemo, useState, useRef, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 } from 'uuid';
import { useNetworkState } from 'react-use';
import { format } from 'date-fns';
import OfflineCreateOrderModal, { ModalRefObject } from './OfflineCreateOrderModal';
import OrderPaymentAction from './OrderPaymentAction';
import {
  DeliveryFeeModal,
  OrderNoteModal,
  OtherDiscountModal,
  ContactList,
  CompletePayment,
} from '~app/features/pos/components';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';
import {
  checkValidPromotion,
  formatOrderFastItem,
  getOrderGrandTotal,
  getOrderTotal,
  handleSelectPromotion,
  initialOrder,
  saveLocalPendingOrders,
  createOrderPrinter,
  DeliveryMethodType,
  toPendingUpdateOrder,
} from '~app/features/pos/utils';
import { ID_EMPTY, RETAILCUSTOMER } from '~app/configs';
import { AuthService } from '~app/services/api';
import { usePrinter } from '~app/utils/hooks';
import { OrderResponseType, OrderStatusType } from '~app/utils/constants';
import { usePosStore } from '~app/features/pos/hooks';
import { useResponseOrderStore } from '~app/features/pos/hooks/useResponseOrder';
import { IngredientOutOfStock, Loading, ProductOutOfStock, Promotions } from '~app/components';
import { useCreateOrderMutation, useUpdateOrderDetailMutation, useUpdateOrderMutation } from '~app/services/mutations';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { useCacheMeQuery, usePaymentsInfo, useGetListKitchenTickets } from '~app/services/queries';
import { SyncType, RequestType } from '~app/features/pos/constants';
import { toCreateOrderInput } from '~app/features/orders/utils';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { filterProductStore } from '~app/features/pos/stores';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  order?: Order;
  orderId?: string;
  amount?: number;
  kitchenTickets?: KitchenTicket;
  orderNumber?: string;
  onSuccess?(): void;
};
type Props = {
  canCompletePayment?: boolean; // if true => can complete payment when click "Payment", is false => open CompletePayment modal
};

const OrderPayment = ({ canCompletePayment = false }: Props) => {
  const confirmCreateOrderOfflineRef = useRef<ModalRefObject>(null);
  const { t } = useTranslation('pos');
  const { online } = useNetworkState();
  const { isLoading: isLoadingCreateOrder, mutateAsync: createOrder } = useCreateOrderMutation();
  const { isLoading: isLoadingUpdateOrder, mutateAsync: updateOrderState } = useUpdateOrderMutation();
  const { mutateAsync: updateOrderDetail } = useUpdateOrderDetailMutation();
  const { data: dataUser } = useCacheMeQuery();
  const {
    syncDataByTypes,
    offlineModeWorker,
    setting: { invoice, pos },
  } = useOfflineContext();
  const { data: paymentsInfo } = usePaymentsInfo();
  const filter = useSyncExternalStore(filterProductStore.subscribe, filterProductStore.getSnapshot);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [confirmCreateOffline, setConfirmCreateOffline] = useState<boolean>(false);
  const [openCompletePayment, setOpenCompletePayment] = useState<boolean>(false);
  const [pendingOrders, setPosStore] = usePosStore((store) => store.pending_orders);
  const [responseOrder, setResponseOrder] = useResponseOrderStore((store) => store);
  const [selectedOrder, setSelectedOrderStore] = useSelectedOrderStore((store) => store);
  const [listOrderItem] = useSelectedOrderStore((store) => store.list_order_item);
  const [buyerInfo] = useSelectedOrderStore((store) => store.buyer_info);
  const [promotionDiscount] = useSelectedOrderStore((store) => store.promotion_discount);
  const [promotionCode] = useSelectedOrderStore((store) => store.promotion_code);
  const [otherDiscount] = useSelectedOrderStore((store) => store.other_discount);
  const [customerPoint] = useSelectedOrderStore((store) => store.customer_point);
  const [deliveryFee] = useSelectedOrderStore((store) => store.delivery_fee);
  const [showPromotionModal, setShowPromotionModal] = usePosStore((store) => store.show_promotion_modal);
  const { data: listKitchenTickets } = useGetListKitchenTickets({
    order_id: selectedOrder.id || '',
  });

  const orderPrinter = createOrderPrinter({
    promotionDiscount,
    businessId: AuthService.getBusinessId() || '',
    order: { ...selectedOrder, reservation_meta: selectedOrder.reservation_info } || {},
    otherDiscount,
    customerPoint: 0,
    deliveryFee,
    customerPointDiscount: selectedOrder.is_customer_point ? selectedOrder.customer_point_discount : 0,
    validPromotion: !!selectedOrder.valid_promotion,
  });

  const { setDebtAmount, handlePrint, showDataPrint } = usePrinter({
    ordersPrint: [orderPrinter],
    configs: invoice,
    paymentsInfo,
    businessInfo: dataUser?.business_info.current_business,
  });

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
    if (buyerInfo.name) {
      setDebtAmount([
        {
          id: '',
          amount: buyerInfo.debt_amount || 0,
        },
      ]);
    }
  }, [buyerInfo]);

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

  const handleSubmitPayment = async (state: OrderStatusType, isOnDelivery: boolean, cbSuccess?: () => void) => {
    try {
      const business_id = await AuthService.getBusinessId();
      if (listOrderItem.length === 0) {
        return toast.error(t('error.empty_order_item'));
      }
      if (selectedOrder.delivery_method === DeliveryMethodType.TABLE && !selectedOrder.reservation_info) {
        return toast.error(t('error.no_select_table'));
      }
      const { id, ...newSelectedOrder } = selectedOrder;
      const data: PendingOrderForm = { ...newSelectedOrder };
      const isUpdateOrder = !!data.created_order_at;
      data.ordered_grand_total = orderTotal;
      data.grand_total = grandTotal;
      data.is_open_delivery = isOnDelivery;

      if (isOnDelivery) {
        // Save order
        data.debit = {
          ...data.debit,
          buyer_pay: 0,
          is_debit: false,
        };
      }

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

      data.debit.buyer_pay >= data.grand_total
        ? Object.assign(data, {
            is_debit: false,
            debit: { ...data.debit, buyer_pay: data.grand_total },
          })
        : Object.assign(data, { is_debit: data.debit.is_debit });

      if (list_product_fast.length > 0) {
        data.list_product_fast = list_product_fast;
      }
      data.list_order_item = list_order_item;
      data.customer_point = data.is_customer_point ? data.customer_point_discount : 0;
      data.customer_point_discount = data.is_customer_point ? data.customer_point_discount : 0;
      data.state = state;
      if (data.delivery_method !== DeliveryMethodType.TABLE && data.reservation_info) {
        data.reservation_info = null;
      }
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
            return setResponseOrder(response);
          }
        }
        // if paying order (not save order) from table then update order state
        if (isUpdateOrder && !isOnDelivery) {
          response = await updateOrderState({ id: id || '', body: toPendingUpdateOrder(data) });
        }
        // create order
        if (!isUpdateOrder) {
          response = await createOrder(data);
        }
        if (response?.status) {
          setResponseOrder(response);
        } else {
          // recall promotion ---> update valid promotion
          // update onboarding mission for new business
          // auto print order via setting
          if (pos?.auto_print_order) {
            setDebtAmount([
              {
                id: '',
                amount: data.buyer_info.debt_amount || 0,
              },
            ]);
            handlePrint();
          }
          if (pendingOrders.length > 1) {
            const newPendingOrders = pendingOrders.filter((order) => order.id !== id);
            setPosStore((store) => {
              saveLocalPendingOrders(newPendingOrders, selectedOrder?.id || '');
              return { ...store, pending_orders: newPendingOrders };
            });
            const newSelectedOrder = newPendingOrders[0];
            if (!newSelectedOrder) return;
            setSelectedOrderStore(() => newSelectedOrder);
          } else {
            const newPendingOrder = initialOrder();
            setPosStore((store) => {
              const newPendingOrders = [newPendingOrder];
              saveLocalPendingOrders(newPendingOrders, selectedOrder?.id || '');
              return { ...store, pending_orders: newPendingOrders };
            });
            setSelectedOrderStore(() => newPendingOrder);
          }
          syncDataByTypes([SyncType.CONTACTS, SyncType.PRODUCTS]);
          resetSearch();
          cbSuccess?.();
          return toast.success(t(isUpdateOrder ? 'success.update_order' : 'success.creat_order'));
        }
      }
    } catch (error) {
      //  TO DO
    }
  };

  const resetSearch = () => {
    offlineModeWorker.postMessage({
      action: RequestType.FILTER_PRODUCT,
      value: {
        ...filter,
        search: '',
      },
    });
    filterProductStore.setFilter({
      search: '',
    });
  };

  const openHistoryOrder = async () => {
    if (listKitchenTickets?.data.kitchen_ticket.length === 0) {
      return toast.error('Bạn chưa có lịch sử đơn hàng nào');
    }

    const modalData: ModalData = {
      modal: ModalTypes.HistoryOrderTable,
      size: ModalSize.Small,
      placement: ModalPlacement.Right,
      kitchenTickets: listKitchenTickets?.data,
      orderNumber: selectedOrder.order_number,
    };
    return setModalData(modalData);
  };

  const handleUpdateProductSoldOutSuccess = (data: ExpectedAny, status: string) => {
    if (status === 'remove') {
      const newListOrderItem = listOrderItem.filter(
        (item) => !data.some((responseItem: ExpectedAny) => responseItem.product_id === item.product_id),
      );
      setSelectedOrderStore((store) => ({ ...store, list_order_item: newListOrderItem }));
    }

    syncDataByTypes([SyncType.PRODUCTS]);
  };

  return (
    <>
      <OrderPaymentAction
        onPayment={handleSubmitPayment}
        openHistoryOrder={openHistoryOrder}
        openCompletePayment={() => setOpenCompletePayment(true)}
        isKitchenPrinting={pos.kitchen_printing}
        canCompletePayment={canCompletePayment}
      />
      <OtherDiscountModal
        orderTotal={orderTotal}
        promotionDiscount={selectedOrder.valid_promotion ? promotionDiscount : 0}
      />
      <DeliveryFeeModal />
      <OrderNoteModal />
      <ContactList />
      {openCompletePayment && (
        <CompletePayment
          open={true}
          grandTotal={grandTotal}
          orderTotal={orderTotal}
          onClose={() => setOpenCompletePayment(false)}
          onPayment={handleSubmitPayment}
        />
      )}
      {showDataPrint()}
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
      {isLoadingCreateOrder || isLoadingUpdateOrder ? (
        <Loading
          backdrop={true}
          vertical={true}
          className="pw-z-2000 !pw-fixed pw-top-0 pw-right-0 pw-left-0 pw-bottom-0"
        />
      ) : null}
      {showPromotionModal && (
        <Promotions
          open={showPromotionModal || false}
          orderTotal={orderTotal}
          promotionCode={promotionCode}
          onChange={(value: SelectedPromotion | null) => {
            const selectedPromotion = handleSelectPromotion({ promotion: value, orderTotal });
            setSelectedOrderStore((prevState) => ({
              ...prevState,
              promotion_code: selectedPromotion.promotion_code,
              promotion_discount: selectedPromotion.promotion_discount,
              selected_promotion: value,
              valid_promotion: true,
            }));
          }}
          onClose={() => setShowPromotionModal((prevState) => ({ ...prevState, show_promotion_modal: false }))}
        />
      )}
      {confirmCreateOffline && (
        <OfflineCreateOrderModal
          ref={confirmCreateOrderOfflineRef}
          open={confirmCreateOffline}
          onClose={() => setConfirmCreateOffline(false)}
        />
      )}
      {responseOrder && responseOrder.status === OrderResponseType.SOLD_OUT && (
        <ProductOutOfStock
          data={responseOrder.items_info}
          open={true}
          onSuccess={handleUpdateProductSoldOutSuccess}
          onClose={() => setResponseOrder(null)}
        />
      )}
      {responseOrder && responseOrder.status === OrderResponseType.SOLD_OUT_GREDIENT && (
        <IngredientOutOfStock data={responseOrder.list_ingredient} open={true} onClose={() => setResponseOrder(null)} />
      )}
    </>
  );
};

export default OrderPayment;
