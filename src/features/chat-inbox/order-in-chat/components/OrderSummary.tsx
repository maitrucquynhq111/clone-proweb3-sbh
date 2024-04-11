import { toast } from 'react-toastify';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import OrderInfo from './OrderInfo';
import OrderPaymentMethod from './OrderPaymentMethod';
import { Promotions } from '~app/components';
import { DeliveryFeeModal, OrderNoteModal, OtherDiscountModal } from '~app/features/pos/components';
import PaymentSetting from '~app/features/pos/components/OrderPayment/PaymentSetting';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import {
  DeliveryMethodType,
  formatOrderFastItem,
  getOrderGrandTotal,
  getOrderTotal,
  handleSelectPromotion,
  initialOrder,
} from '~app/features/pos/utils';
import { formatCurrency } from '~app/utils/helpers';
import { useCurrentConversation } from '~app/utils/hooks';
import { ID_EMPTY } from '~app/configs';
import { AuthService } from '~app/services/api';
import { useCreateChatOrderMutation } from '~app/services/mutations';
import { getParticipant } from '~app/features/chat-inbox/utils';
import { ConversationTag, OrderStatusType, OrderCreateMethod, MessageType } from '~app/utils/constants';
import { useChatStore } from '~app/features/chat-inbox/hooks';
import { CustomerInfo } from '~app/features/chat-inbox/components';

type Props = {
  onSendMessage: (value: string, type: MessageType) => void;
};

const OrderSummary = ({ onSendMessage }: Props) => {
  const { t } = useTranslation('pos');
  const { currentConversation } = useCurrentConversation();
  const [, setChatStore] = useChatStore((store) => store.showOrderInChat);
  const [showPromotionModal, setShowPromotionModal] = usePosStore((store) => store.show_promotion_modal);
  const [selectedOrder, setSelectedOrderStore] = useSelectedOrderStore((store) => store);
  const { mutateAsync, isLoading } = useCreateChatOrderMutation();

  const [phoneError, setPhoneError] = useState(false);

  const orderedGrandTotal = useMemo(() => {
    const total = getOrderTotal(selectedOrder.list_order_item);
    return total;
  }, [selectedOrder.list_order_item]);

  const grandTotal = useMemo(
    () =>
      getOrderGrandTotal({
        orderTotal: orderedGrandTotal,
        promotionDiscount: selectedOrder.promotion_discount,
        otherDiscount: selectedOrder.other_discount,
        deliveryFee: selectedOrder.delivery_fee,
        customerPointDiscount: selectedOrder.is_customer_point ? selectedOrder.customer_point_discount : 0,
        validPromotion: selectedOrder.valid_promotion,
      }),
    [orderedGrandTotal, selectedOrder],
  );

  const otherParticipant = useMemo(() => {
    return getParticipant(currentConversation?.participants || [], false);
  }, [currentConversation]);

  const handlePromotionChange = useCallback(
    (value: SelectedPromotion | null) => {
      const selectedPromotion = handleSelectPromotion({ promotion: value, orderTotal: orderedGrandTotal });
      setSelectedOrderStore((prevState) => ({
        ...prevState,
        promotion_code: selectedPromotion.promotion_code,
        promotion_discount: selectedPromotion.promotion_discount,
        selected_promotion: value,
        valid_promotion: true,
      }));
    },
    [orderedGrandTotal, setSelectedOrderStore],
  );

  const handleCreateOrder = async () => {
    try {
      const business_id = await AuthService.getBusinessId();
      if (selectedOrder.list_order_item.length === 0) return toast.error(t('error.empty_order_item'));
      const { id, ...newSelectedOrder } = selectedOrder;
      const data: PendingChatOrderForm = {
        business_id: business_id || '',
        buyer_id: '',
        buyer_info: newSelectedOrder.buyer_info,
        create_method: OrderCreateMethod.SELLER,
        delivery_fee: newSelectedOrder.delivery_fee,
        delivery_method: DeliveryMethodType.SELLER_DELIVERY,
        email: '',
        grand_total: grandTotal,
        ordered_grand_total: orderedGrandTotal,
        list_order_item: newSelectedOrder.list_order_item,
        note: newSelectedOrder.note,
        other_discount: newSelectedOrder.other_discount,
        payment_method: newSelectedOrder.payment_method,
        promotion_code: newSelectedOrder.promotion_code,
        promotion_discount: newSelectedOrder.promotion_discount,
        state: OrderStatusType.WAITING_CONFIRM,
      };
      // if (!newSelectedOrder?.buyer_info?.phone_number) {
      //   setPhoneError(true);
      //   return toast.error(t('error.empty_phone_number'));
      // }
      const list_order_item: PendingOrderItem[] = [];
      const list_product_fast: FastProduct[] = [];
      data.list_order_item.filter((item) => {
        const { id, can_pick_quantity, ...newItem } = item as PendingOrderItem;
        if (item.product_id !== ID_EMPTY) {
          list_order_item.push(newItem);
        } else {
          list_product_fast.push({
            ...formatOrderFastItem(newItem),
            business_id: business_id || '',
          });
        }
      });
      data.list_order_item = list_order_item;
      const buyer_id = currentConversation?.tag === ConversationTag.FB_MESSAGE ? otherParticipant?.info?.id : null;
      const buyer_business_id = otherParticipant?.info?.id;
      data.buyer_id = buyer_id;
      data.buyer_info = {
        ...data.buyer_info,
        type: 'wholesale_buyer',
        business_id: buyer_business_id,
      };
      data.conversation_id = currentConversation?.id || '';
      const response = await mutateAsync(data);
      onSendMessage(response?.order_number || '', MessageType.ORDER);
      setChatStore((store) => ({ ...store, showOrderInChat: false }));
      setSelectedOrderStore(() => initialOrder());
      return toast.success(t('success.creat_order'));
    } catch (error) {
      // TO DO
    }
  };

  return (
    <>
      <div className="pw-flex pw-flex-col pw-flex-1 pw-h-full pw-overflow-auto pw-bg-neutral-white scrollbar-sm">
        <CustomerInfo error={phoneError} setError={setPhoneError} />
        <OrderPaymentMethod />
        <OrderInfo
          orderedGrandTotal={orderedGrandTotal}
          className="pw-flex-1 pw-border-l pw-border-solid pw-border-neutral-divider"
        />
      </div>
      <div className="pw-justify-self-end pw-py-4 pw-px-6 pw-bg-neutral-white pw-shadow-dropdown">
        <div className="pw-flex pw-justify-between pw-mb-4">
          <h3 className="pw-font-bold pw-text-base pw-text-neutral-primary">{t('total')}</h3>
          <span className="pw-text-red-500 pw-text-xl pw-font-bold">{formatCurrency(grandTotal)}</span>
        </div>
        <PaymentSetting />
        <div className="pw-flex pw-gap-x-2 pw-mt-4 pw-justify-between pw-items-center">
          <Button
            onClick={handleCreateOrder}
            loading={isLoading}
            className="!pw-p-3 !pw-bg-primary-main !pw-rounded !pw-flex-1
              !pw-text-base !pw-font-bold !pw-text-neutral-white"
          >
            {t('action.create_order')}
          </Button>
        </div>
      </div>
      <OtherDiscountModal
        orderTotal={orderedGrandTotal}
        promotionDiscount={selectedOrder.valid_promotion ? selectedOrder.promotion_discount : 0}
      />
      <DeliveryFeeModal />
      <OrderNoteModal />
      {showPromotionModal ? (
        <Promotions
          open={showPromotionModal || false}
          orderTotal={orderedGrandTotal}
          promotionCode={selectedOrder.promotion_code}
          onChange={handlePromotionChange}
          onClose={() => setShowPromotionModal((prevState) => ({ ...prevState, show_promotion_modal: false }))}
        />
      ) : null}
    </>
  );
};

export default OrderSummary;
