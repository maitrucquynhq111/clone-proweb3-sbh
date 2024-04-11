import { toast } from 'react-toastify';
import { useEffect, useMemo, useState } from 'react';
import { Button } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { BsPencilFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { toCreateOrderInput, toPendingOrder } from '../utils';
import { orderFormSchema } from './config';
import { PosProvider, SelectedOrderProvider, usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import {
  CONTACT_DETAIL,
  ORDERS_ANALYTICS_KEY,
  ORDERS_KEY,
  ORDER_DETAIL_KEY,
  ORDER_TRACKING_KEY,
  useCacheMeQuery,
  useGetInvoiceSetting,
  useOrderDetailQuery,
  usePaymentsInfo,
} from '~app/services/queries';
import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  IngredientOutOfStock,
  Loading,
  ProductOutOfStock,
} from '~app/components';
import FormLayout from '~app/components/HookForm/FormLayout';
import ProductDrawerContainer from '~app/features/pos/components/ProductDrawer/ProductDrawerContainer';
import { OrderResponseType, OrderStatusType } from '~app/utils/constants';
import { OrderPermission, useHasPermissions } from '~app/utils/shield';
import { CancelOrderModal, PrintOrderButton, RefuseOrderModal } from '~app/features/orders/components';
import { useUpdateOrderDetailMutation, useUpdateOrderMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import { getOrderGrandTotal, getOrderTotal } from '~app/features/pos/utils';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  order?: Order;
  orderId?: string;
  amount?: number;
  onSuccess?(): void;
};

const OrderDetail = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { t } = useTranslation('orders-form');
  const navigate = useNavigate();
  const [isEdit, setPosStore] = usePosStore((store) => store.is_edit_order);
  const [state, setSelectedOrderStore] = useSelectedOrderStore((store) => store.state as OrderStatusType);
  const [paymentOrderHistory] = useSelectedOrderStore((store) => store.payment_order_history);
  const [selectedOrder] = useSelectedOrderStore((store) => store);
  const { data: dataUser } = useCacheMeQuery();
  const { data: invoiceSettings } = useGetInvoiceSetting();
  const { data: paymentsInfo } = usePaymentsInfo();
  const {
    data: orderDetail,
    isError: isOrderDetailError,
    isLoading: isLoadingOrderDetail,
  } = useOrderDetailQuery(id ? id : '');
  const { mutateAsync: mutateUpdateOrderAsync, isLoading: isUpdateOrderLoading } = useUpdateOrderMutation();
  const { mutateAsync: mutateUpdateOrderDetailAsync, isLoading: isUpdateOrderDetailLoading } =
    useUpdateOrderDetailMutation();
  const [open, setOpen] = useState(false);
  const [responseOrder, setResponseOrder] = useState<ExpectedAny>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const hasUpdateOrderPermission = useHasPermissions([OrderPermission.ORDER_INVOICE_COGS_ALL_VIEW]);
  const hasCancelOrderPermission = useHasPermissions([OrderPermission.ORDER_ORDERDETAIL_CANCEL]);
  const hasCompleteOrderPermission = useHasPermissions([OrderPermission.ORDER_ORDERDETAIL_COMPLETE]);
  const hasDeleteOrderPermission = useHasPermissions([OrderPermission.ORDER_ORDERDETAIL_DELETE]);
  const hasPrintOrderPermission = useHasPermissions([OrderPermission.ORDER_ORDERDETAIL_PRINT_ALL_VIEW]);

  const canEdit = useMemo(() => {
    if (!hasUpdateOrderPermission) return false;
    if (
      state === OrderStatusType.RETURN ||
      state === OrderStatusType.REFUND ||
      state === OrderStatusType.CANCEL ||
      state === OrderStatusType.COMPLETE
    )
      return false;
    return true;
  }, [state, hasUpdateOrderPermission]);
  const canCancel = useMemo(() => {
    if (!hasCancelOrderPermission) return false;
    if ((state === OrderStatusType.WAITING_CONFIRM || state === OrderStatusType.DELIVERING) && hasCancelOrderPermission)
      return true;
    return false;
  }, [state, hasCancelOrderPermission]);
  const canComplete = useMemo(() => {
    return hasCompleteOrderPermission;
  }, [hasCompleteOrderPermission]);
  const canDelete = useMemo(() => {
    return hasDeleteOrderPermission;
  }, [hasDeleteOrderPermission]);
  const showPrintButton = useMemo(() => {
    if (state === OrderStatusType.CANCEL || state === OrderStatusType.REFUND || state === OrderStatusType.RETURN)
      return false;
    return true;
  }, [state]);
  const showFooter = useMemo(() => {
    if (state === OrderStatusType.CANCEL || state === OrderStatusType.REFUND || state === OrderStatusType.RETURN)
      return false;
    return true;
  }, [state]);

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

  const handleChangeEditState = () => {
    setPosStore((store) => ({ ...store, is_edit_order: !store.is_edit_order }));
  };

  const handleCancelChange = () => {
    setPosStore((store) => ({ ...store, is_edit_order: false }));
    if (!orderDetail) return;
    setSelectedOrderStore(toPendingOrder(orderDetail));
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const reValidateQuery = () => {
    queryClient.invalidateQueries([ORDERS_KEY], { exact: false });
    queryClient.invalidateQueries([ORDERS_ANALYTICS_KEY], { exact: false });
    queryClient.invalidateQueries([ORDER_DETAIL_KEY], { exact: false });
    queryClient.invalidateQueries([CONTACT_DETAIL], { exact: false });
    queryClient.invalidateQueries([ORDER_TRACKING_KEY], { exact: false });
  };

  const handleCancelOrder = async (cancel_transaction?: string[]) => {
    try {
      if (!orderDetail) return;
      if (state === OrderStatusType.WAITING_CONFIRM) {
        const body = {
          state: OrderStatusType.CANCEL,
          debit: null,
          additional_info: {},
          payment_source_id: null,
          payment_source_name: null,
          reservation_info: null,
        };
        await mutateUpdateOrderAsync({ id: orderDetail.id, body });
        setOpen(false);
        reValidateQuery();
        toast.success(t('success.update'));
      }
      if (state === OrderStatusType.DELIVERING) {
        const body = {
          state: OrderStatusType.CANCEL,
          debit: null,
          additional_info: {},
          payment_source_id: null,
          payment_source_name: null,
          reservation_info: orderDetail?.reservation_meta ? orderDetail.reservation_meta : null,
          is_customer_point: orderDetail?.customer_point_discount > 0 ? true : false,
          cancel_transaction,
        };
        await mutateUpdateOrderAsync({ id: orderDetail.id, body });
        setOpen(false);
        reValidateQuery();
        toast.success(t('success.update'));
      }
      if (state === OrderStatusType.COMPLETE) {
        const amount = orderDetail?.amount_paid || 0;
        const modalData: ModalData = {
          modal: ModalTypes.CancelCompleteOrder,
          size: ModalSize.Xsmall,
          placement: ModalPlacement.Right,
          orderId: orderDetail.id,
          amount: amount,
          onSuccess: () => {
            setModalData(null);
            queryClient.invalidateQueries([ORDER_DETAIL_KEY], { exact: false });
            queryClient.invalidateQueries([CONTACT_DETAIL], { exact: false });
            return;
          },
        };
        return setModalData(modalData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateOrderDetail = async () => {
    try {
      const data = toCreateOrderInput(selectedOrder);
      data.ordered_grand_total = orderTotal;
      data.grand_total = grandTotal;
      data.created_at = orderDetail?.created_at || '';
      data.amount_paid = orderDetail?.amount_paid || 0;
      const response = await mutateUpdateOrderDetailAsync({ id: data.id, body: data });

      if (response?.status) return setResponseOrder(response);

      setPosStore((store) => ({ ...store, is_edit_order: false }));
      reValidateQuery();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateOrder = async () => {
    try {
      if (!orderDetail) return;
      if (state === OrderStatusType.WAITING_CONFIRM) {
        const body = {
          state: OrderStatusType.DELIVERING,
          debit: {
            buyer_pay: 0,
            description: '',
            is_debit: true,
          },
          additional_info: {},
          payment_source_id: null,
          payment_source_name: null,
          reservation_info: null,
        };
        const response = await mutateUpdateOrderAsync({ id: orderDetail.id, body });
        if (response?.status) return setResponseOrder(response);
        reValidateQuery();
        return toast.success(t('success.update'));
      }
      if (state === OrderStatusType.DELIVERING) {
        if (orderDetail.amount_paid - orderDetail.grand_total >= 0) {
          const body = {
            state: OrderStatusType.COMPLETE,
            additional_info: {},
            payment_source_id: null,
            payment_source_name: null,
            reservation_info: null,
          };
          const response = await mutateUpdateOrderAsync({ id: orderDetail.id, body });
          if (response?.status) return setResponseOrder(response);
          reValidateQuery();
          return toast.success(t('success.update'));
        }
        const order: Order = {
          ...orderDetail,
          grand_total: grandTotal,
          ordered_grand_total: orderTotal,
          amount_paid: orderDetail.amount_paid,
        };
        const modalData: ModalData = {
          modal: ModalTypes.ConfirmPaying,
          size: ModalSize.Xsmall,
          placement: ModalPlacement.Right,
          order: order,
          onSuccess: () => {
            setModalData(null);
            queryClient.invalidateQueries([ORDER_DETAIL_KEY], { exact: false });
            queryClient.invalidateQueries([CONTACT_DETAIL], { exact: false });
            return;
          },
        };
        setModalData(modalData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!orderDetail) return;
    setSelectedOrderStore((store) => {
      const newStore = toPendingOrder(orderDetail);
      newStore.buyer_info = { ...newStore.buyer_info, debt_amount: store.buyer_info.debt_amount };
      newStore.customer_point = store.customer_point;
      return { ...newStore };
    });
  }, [orderDetail, setSelectedOrderStore]);

  useEffect(() => {
    setPosStore((store) => ({ ...store, pending_orders: [], selected_product: null, selected_drawer: null }));
  }, [setPosStore]);

  useEffect(() => {
    if (isOrderDetailError) onClose();
  }, [isOrderDetailError]);

  return (
    <>
      <DrawerHeader title={`${t('order_detail')} - ${id}`} onClose={() => navigate(-1)}>
        <div className="pw-flex pw-flex-1 pw-justify-end pw-gap-x-2 pw-mr-2">
          {!isEdit ? (
            <>
              {canEdit ? (
                <button
                  className="pw-flex pw-font-bold pw-text-neutral-primary pw-text-sm pw-py-1.5 pw-px-4 pw-rounded
                  pw-bg-neutral-white pw-border pw-border-solid pw-border-neutral-border pw-gap-x-2 pw-items-center"
                  onClick={handleChangeEditState}
                >
                  <BsPencilFill />
                  {t('action.edit_order')}
                </button>
              ) : null}
              {hasPrintOrderPermission && showPrintButton ? (
                <PrintOrderButton invoiceSettings={invoiceSettings} dataUser={dataUser} paymentsInfo={paymentsInfo} />
              ) : null}
            </>
          ) : null}
        </div>
      </DrawerHeader>
      <DrawerBody className="pw-bg-neutral-background">
        <FormLayout formSchema={orderFormSchema({ isEdit, state })} />
      </DrawerBody>
      {showFooter ? (
        <DrawerFooter>
          {isEdit ? (
            <>
              <Button
                className="pw-button-secondary !pw-py-3 !pw-px-4 !pw-text-base !pw-font-bold !pw-text-neutral-primary"
                onClick={handleCancelChange}
              >
                {t('action.cancel_change')}
              </Button>
              <Button
                className="pw-button-primary !pw-py-3 !pw-px-4 !pw-text-base !pw-font-bold !pw-text-neutral-white"
                type="submit"
                onClick={handleUpdateOrderDetail}
              >
                {t('action.update')}
              </Button>
            </>
          ) : null}
          {!isEdit && state !== OrderStatusType.COMPLETE && canCancel ? (
            <Button
              className="pw-button-secondary !pw-py-3 !pw-px-4 !pw-text-base !pw-font-bold !pw-text-neutral-primary"
              onClick={handleOpenModal}
            >
              {t('action.cancel_order')}
            </Button>
          ) : null}
          {!isEdit && state === OrderStatusType.COMPLETE && canDelete ? (
            <Button
              className="pw-button-secondary !pw-py-3 !pw-px-4 !pw-text-base !pw-font-bold !pw-text-neutral-primary"
              onClick={() => handleCancelOrder()}
            >
              {t('action.cancel_order')}
            </Button>
          ) : null}
          {!isEdit && state === OrderStatusType.WAITING_CONFIRM ? (
            <Button
              className="pw-button-primary !pw-py-3 !pw-px-4 !pw-text-base !pw-font-bold !pw-text-neutral-white"
              onClick={handleUpdateOrder}
            >
              {t('action.confirm_order')}
            </Button>
          ) : null}
          {!isEdit && state === OrderStatusType.DELIVERING && canComplete ? (
            <Button
              className="pw-button-primary !pw-py-3 !pw-px-4 !pw-text-base !pw-font-bold !pw-text-neutral-white"
              onClick={handleUpdateOrder}
            >
              {t('action.complete_order')}
            </Button>
          ) : null}
        </DrawerFooter>
      ) : null}
      <ProductDrawerContainer />
      {state === OrderStatusType.WAITING_CONFIRM && open ? (
        <RefuseOrderModal open={open} setOpen={setOpen} onClick={handleCancelOrder} />
      ) : null}
      {state === OrderStatusType.DELIVERING && open ? (
        <CancelOrderModal
          paymentOrderHistory={paymentOrderHistory || []}
          open={open}
          onClose={() => setOpen(false)}
          onClick={handleCancelOrder}
        />
      ) : null}
      {responseOrder && responseOrder.status === OrderResponseType.SOLD_OUT && (
        <ProductOutOfStock
          data={responseOrder.items_info}
          hideDelete
          open={true}
          onClose={() => setResponseOrder(null)}
        />
      )}
      {responseOrder && responseOrder.status === OrderResponseType.SOLD_OUT_GREDIENT && (
        <IngredientOutOfStock
          data={responseOrder.list_ingredient}
          hideDelete
          open={true}
          onClose={() => setResponseOrder(null)}
        />
      )}
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
      {isUpdateOrderLoading || isUpdateOrderDetailLoading || isLoadingOrderDetail ? (
        <Loading backdrop={true} vertical={true} className="pw-z-2000" />
      ) : null}
    </>
  );
};

const OrderDetailWrapper = (props: { id: string; onClose: () => void }) => {
  return (
    <PosProvider>
      <SelectedOrderProvider>
        <OrderDetail {...props} />
      </SelectedOrderProvider>
    </PosProvider>
  );
};

export default OrderDetailWrapper;
