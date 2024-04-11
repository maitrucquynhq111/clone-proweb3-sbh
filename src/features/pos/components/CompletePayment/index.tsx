import { useTranslation } from 'react-i18next';
import { Button, Drawer } from 'rsuite';
import { DrawerBody, DrawerFooter, DrawerHeader } from '~app/components';
import PaymentInfo from '~app/features/pos/components/OrderPayment/PaymentInfo';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { OrderStatusType } from '~app/utils/constants';
import { DeliveryMethodType } from '~app/features/pos/utils';
import { formatCurrency } from '~app/utils/helpers';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';

type Props = {
  open: boolean;
  orderTotal: number;
  grandTotal: number;
  onPayment(state: OrderStatusType, isOnDelivery: boolean, cbSuccess?: () => void): void;
  onClose: () => void;
};

const CompletePayment = ({ open, orderTotal, grandTotal, onClose, onPayment }: Props): JSX.Element => {
  const { t } = useTranslation('pos');
  const [selectedOrder] = useSelectedOrderStore((store) => store);
  const [isCustomerPoint] = useSelectedOrderStore((store) => store.is_customer_point);
  const [listOrderItem] = useSelectedOrderStore((store) => store.list_order_item);
  const [customerPointDiscount] = useSelectedOrderStore((store) => store.customer_point_discount);
  const [promotionCode] = useSelectedOrderStore((store) => store.promotion_code);
  const [promotionDiscount] = useSelectedOrderStore((store) => store.promotion_discount);
  const [showOtherDiscount] = useSelectedOrderStore((store) => store.show_other_discount);
  const [otherDiscount] = useSelectedOrderStore((store) => store.other_discount);
  const [showDeliveryFee] = useSelectedOrderStore((store) => store.show_delivery_fee);
  const [deliveryFee] = useSelectedOrderStore((store) => store.delivery_fee);
  const [showNote] = useSelectedOrderStore((store) => store.show_note);
  const [note] = useSelectedOrderStore((store) => store.note);
  const {
    setting: { bussiness },
  } = useOfflineContext();

  const onSubmit = async () => {
    try {
      onPayment(OrderStatusType.COMPLETE, false);
      handleClose();
    } catch (error) {
      // TO DO
    }
  };

  const handleClose = () => {
    onClose();
  };

  const getNameTabItem = () => {
    if (selectedOrder.delivery_method === DeliveryMethodType.TABLE)
      return `${selectedOrder.reservation_info?.sector_name} - ${selectedOrder.reservation_info?.table_name}`;

    return t(selectedOrder.delivery_method);
  };

  return (
    <Drawer open={open} onClose={handleClose} size="sm" keyboard={false} backdrop="static">
      <div className="pw-flex pw-flex-col !pw-h-screen">
        <DrawerHeader title={`${t('modal-title:confirm-paying')} ${getNameTabItem()}`} onClose={handleClose} />
        <DrawerBody className="pw-bg-white !pw-p-4">
          <div className="pw-pb-4">
            <div className="pw-flex pw-justify-between pw-items-center">
              <span className="pw-font-normal pw-text-sm pw-text-neutral-primary">
                {t('total_products', { totalProducts: listOrderItem.length })}
              </span>
              <div className="pw-flex pw-items-center pw-gap-x-2">
                <span className="pw-text-neutral-primary pw-text-base pw-font-semibold">
                  {formatCurrency(orderTotal)}
                </span>
              </div>
            </div>
            {bussiness?.is_customer_point && isCustomerPoint && customerPointDiscount > 0 && (
              <div className="pw-flex pw-py-1 pw-justify-between pw-items-center pw-mt-4">
                <div className="pw-flex pw-items-center pw-gap-x-3">
                  <span className="pw-text-sm pw-text-neutral-primary">{t('customer_point')}</span>
                </div>
                <div className="pw-text-base pw-font-semibold pw-text-neutral-primary">
                  {formatCurrency(customerPointDiscount)}
                </div>
              </div>
            )}
            {showOtherDiscount ? (
              <div className="pw-flex pw-py-1 pw-justify-between pw-items-center pw-mt-4">
                <div className="pw-flex pw-items-center pw-gap-x-3">
                  <span className="pw-text-sm pw-text-neutral-primary">{t('other_discount')}</span>
                </div>
                <div className="pw-text-base pw-font-semibold pw-text-neutral-primary">
                  {formatCurrency(otherDiscount)}
                </div>
              </div>
            ) : null}
            {showDeliveryFee ? (
              <div className="pw-flex pw-py-1 pw-justify-between pw-items-center pw-mt-4">
                <div className="pw-flex pw-items-center pw-gap-x-3">
                  <span className="pw-text-sm pw-text-neutral-primary">{t('delivery')}</span>
                </div>
                <div className="pw-text-base pw-font-semibold pw-text-neutral-primary">
                  {formatCurrency(deliveryFee)}
                </div>
              </div>
            ) : null}
            {promotionCode ? (
              <div className="pw-flex pw-py-1 pw-justify-between pw-items-center pw-mt-4">
                <div className="pw-flex pw-items-center pw-gap-x-3">
                  <span className="pw-text-sm pw-text-neutral-primary">{t('promotion')}</span>
                </div>
                <div className="pw-text-base pw-font-semibold pw-text-neutral-primary">
                  {formatCurrency(promotionDiscount)}
                </div>
              </div>
            ) : null}
            {showNote ? (
              <div className="pw-flex pw-py-1 pw-justify-between pw-items-center pw-mt-4">
                <div className="pw-flex pw-items-center pw-gap-x-3">
                  <span className="pw-text-sm pw-text-neutral-primary">{t('note')}</span>
                </div>
                <div className="pw-text-base pw-font-semibold pw-text-neutral-primary">{note}</div>
              </div>
            ) : null}
          </div>
          <PaymentInfo
            className="pw-py-4 pw-border-t pw-border-neutral-divider"
            orderTotal={orderTotal}
            grandTotal={grandTotal}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button className="!pw-py-3 !pw-px-6" appearance="ghost" onClick={handleClose}>
            {t('common:back')}
          </Button>
          <Button className="!pw-py-3 !pw-px-6" appearance="primary" onClick={onSubmit}>
            {t('common:modal-confirm')}
          </Button>
        </DrawerFooter>
      </div>
    </Drawer>
  );
};

export default CompletePayment;
