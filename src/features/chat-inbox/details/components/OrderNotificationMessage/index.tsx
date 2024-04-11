import { toast } from 'react-toastify';
import { useMemo, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Placeholder } from 'rsuite';
import { formatDateToString, isJsonString } from '~app/utils/helpers';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { useUpdateOrderMutation } from '~app/services/mutations';
import { ORDER_DETAIL_KEY, useOrderDetailQuery } from '~app/services/queries';
import { OrderPermission, useHasPermissions } from '~app/utils/shield';
import { queryClient } from '~app/configs/client';
import { OrderResponseType, OrderStatusType } from '~app/utils/constants';
import { IngredientOutOfStock, ProductOutOfStock } from '~app/components';
import { CancelOrderModal, RefuseOrderModal } from '~app/features/orders/components';
import { CompletedOrder, DeliveringOrder, WaitingConfirmOrder } from '~app/components/Icons';

type Props = {
  messageContent: MessageResponse;
  className?: string;
};

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  order?: Order;
  orderId?: string;
  amount?: number;
  onSuccess?(): void;
};

const OrderNotificationMessage = ({ messageContent, className }: Props) => {
  const { t } = useTranslation(['orders-form', 'common']);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [responseOrder, setResponseOrder] = useState<ExpectedAny>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const orderMessage = useMemo(() => {
    return (
      (isJsonString(messageContent.message) && (JSON.parse(messageContent.message) as NotificationMessageType)) || null
    );
  }, [messageContent]);

  const { mutateAsync: mutateUpdateOrderAsync } = useUpdateOrderMutation();
  const { data: orderDetail, isFetching } = useOrderDetailQuery(orderMessage?.addition || '', false);

  // Permission
  const hasUpdateOrderPermission = useHasPermissions([OrderPermission.ORDER_CART_UPDATE]);
  const hasCancelOrderPermission = useHasPermissions([OrderPermission.ORDER_ORDERDETAIL_CANCEL]);
  const hasCompleteOrderPermission = useHasPermissions([OrderPermission.ORDER_ORDERDETAIL_COMPLETE]);

  const handleCancelOrder = async (cancel_transaction?: string[]) => {
    try {
      if (!orderDetail) return;
      if (orderDetail.state === OrderStatusType.WAITING_CONFIRM) {
        const body = {
          state: OrderStatusType.CANCEL,
          debit: null,
          additional_info: {},
          payment_source_id: null,
          payment_source_name: null,
          reservation_info: null,
        };
        await mutateUpdateOrderAsync({ id: orderDetail.id, body });
        queryClient.invalidateQueries([ORDER_DETAIL_KEY, orderMessage?.addition], { exact: true });
        setOpen(false);
        return toast.success(t('success.update'));
      }
      if (orderDetail.state === OrderStatusType.DELIVERING) {
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
        queryClient.invalidateQueries([ORDER_DETAIL_KEY, orderMessage?.addition], { exact: true });
        setOpen(false);
        return toast.success(t('success.update'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateOrder = async () => {
    try {
      if (!orderDetail) return;
      if (orderDetail.state === OrderStatusType.WAITING_CONFIRM) {
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
        queryClient.invalidateQueries([ORDER_DETAIL_KEY, orderMessage?.addition], { exact: true });
        return toast.success(t('success.update'));
      }
      if (orderDetail.state === OrderStatusType.DELIVERING) {
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
          return toast.success(t('success.update'));
        }
        const order: Order = {
          ...orderDetail,
          grand_total: orderDetail.grand_total,
          ordered_grand_total: orderDetail.ordered_grand_total,
          amount_paid: orderDetail.amount_paid,
        };
        const modalData: ModalData = {
          modal: ModalTypes.ConfirmPaying,
          size: ModalSize.Xsmall,
          placement: ModalPlacement.Right,
          order: order,
          onSuccess: () => {
            setModalData(null);
            return queryClient.invalidateQueries([ORDER_DETAIL_KEY, orderMessage?.addition], { exact: true });
          },
        };
        setModalData(modalData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewDetail = () => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.OrderDetails,
        id: orderMessage?.addition || '',
      })}`,
    });
  };

  const handleOpenModal = () => setOpen(true);

  return (
    <div className={className}>
      {messageContent?.created_at ? (
        <p className="pw-text-xs pw-font-semibold pw-text-neutral-secondary pw-text-center pw-mb-3">
          {formatDateToString(messageContent.created_at, 'HH:mm dd/MM/yyyy')}
        </p>
      ) : null}
      <div className="pw-flex pw-gap-x-2 pw-items-end pw-max-w-8/12">
        <div className="pw-min-w-6">
          {orderDetail && orderDetail.state === OrderStatusType.WAITING_CONFIRM ? <WaitingConfirmOrder /> : null}
          {orderDetail && orderDetail.state === OrderStatusType.DELIVERING ? <DeliveringOrder /> : null}
          {orderDetail && orderDetail.state === OrderStatusType.COMPLETE ? <CompletedOrder /> : null}
        </div>
        <div
          className="pw-rounded pw-py-3 pw-px-4 pw-bg-neutral-divider pw-flex-1 hover:pw-cursor-pointer"
          onClick={handleViewDetail}
        >
          <>
            {isFetching ? (
              <div className="pw-flex pw-items-center pw-ml-3 pw-mr-5 pw-mb-2 pw-min-h-64">
                <Placeholder.Graph className="pw-rounded pw-mr-2" active width={18} height={18} />
                <Placeholder.Graph active className="pw-rounded" height={18} />
              </div>
            ) : (
              <>
                <h4 className="pw-font-bold pw-text-neutral-title pw-text-base pw-mb-3">{orderMessage?.title || ''}</h4>
                <p className="pw-text-base pw-text-neutral-primary pw-mb-3">{orderMessage?.content || ''}</p>
                <div
                  className="pw-flex pw-gap-x-2"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {orderDetail && orderDetail.state === OrderStatusType.WAITING_CONFIRM && hasCancelOrderPermission ? (
                    <Button
                      className="pw-button-secondary !pw-py-1.5 !pw-px-4 !pw-text-base !pw-font-bold !pw-text-neutral-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal();
                      }}
                    >
                      {t('common:modal-confirm-refuse-btn')}
                    </Button>
                  ) : null}
                  {orderDetail && orderDetail.state === OrderStatusType.DELIVERING && hasCancelOrderPermission ? (
                    <Button
                      className="pw-button-secondary !pw-py-1.5 !pw-px-4 !pw-text-base !pw-font-bold !pw-text-neutral-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal();
                      }}
                    >
                      {t('action.cancel_order')}
                    </Button>
                  ) : null}
                  {orderDetail && orderDetail.state === OrderStatusType.WAITING_CONFIRM && hasUpdateOrderPermission ? (
                    <Button
                      className="pw-button-primary !pw-py-1.5 !pw-px-4 !pw-text-base !pw-font-bold !pw-text-neutral-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateOrder();
                      }}
                    >
                      {t('action.confirm_order')}
                    </Button>
                  ) : null}
                  {orderDetail && orderDetail.state === OrderStatusType.DELIVERING && hasCompleteOrderPermission ? (
                    <Button
                      className="pw-button-primary !pw-py-1.5 !pw-px-4 !pw-text-base !pw-font-bold !pw-text-neutral-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateOrder();
                      }}
                    >
                      {t('action.complete_order')}
                    </Button>
                  ) : null}
                  {orderDetail?.state === OrderStatusType.WAITING_CONFIRM && open ? (
                    <RefuseOrderModal open={open} setOpen={setOpen} onClick={handleCancelOrder} />
                  ) : null}
                  {orderDetail?.state === OrderStatusType.DELIVERING && open ? (
                    <CancelOrderModal
                      paymentOrderHistory={orderDetail?.payment_order_history || []}
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
                </div>
              </>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default OrderNotificationMessage;
