import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsXCircle } from 'react-icons/bs';
import EmptyState from './EmptyState';
import { RETAILCUSTOMER } from '~app/configs';
import { OrderItems, OrderPayment, SearchLocationInput } from '~app/features/pos/components';
import OrderPaymentInfo from '~app/features/pos/components/OrderPayment/OrderPaymentInfo';
import { DeliveryMethodType } from '~app/features/pos/utils';
import { useSelectedOrderStore, usePosStore } from '~app/features/pos/hooks';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';

type Props = {
  removeContact?(): void;
};

const SummaryFnb = ({ removeContact }: Props) => {
  const { t } = useTranslation('pos');
  const [listOrderItem] = useSelectedOrderStore((store) => store.list_order_item);
  const [buyerInfo] = useSelectedOrderStore((store) => store.buyer_info);
  const [deliveryMethod] = useSelectedOrderStore((store) => store.delivery_method);
  const [, setPosStore] = usePosStore((store) => store.show_delivery_fee_modal);

  const {
    setting: { pos },
  } = useOfflineContext();

  return (
    <>
      {(buyerInfo?.phone_number || buyerInfo?.name) && buyerInfo?.phone_number !== RETAILCUSTOMER.phone_number && (
        <div className="pw-p-3 pw-border-b-4 pw-border-solid pw-border-neutral-divider">
          <div className="pw-py-1 pw-px-3 pw-flex pw-items-center pw-justify-between ">
            <div className="pw-flex pw-items-center pw-justify-center pw-gap-x-3 pw-text-base">
              <button onClick={removeContact}>
                <BsXCircle size={20} className="pw-fill-neutral-secondary" />
              </button>
              <span>{t('contact')}</span>
            </div>
            <button onClick={() => setPosStore((store) => ({ ...store, show_customer_modal: true }))}>
              <span className="pw-text-blue-700 pw-font-semibold pw-text-base">
                {buyerInfo.name} {buyerInfo.phone_number && `(${buyerInfo.phone_number})`}
              </span>
            </button>
          </div>
          {buyerInfo.name && (!pos?.fnb_active || deliveryMethod === DeliveryMethodType.SELLER_DELIVERY) && (
            <div className="pw-p-3">
              <SearchLocationInput />
            </div>
          )}
        </div>
      )}
      {listOrderItem.length > 0 ? (
        <>
          <div className="pw-flex pw-flex-col pw-justify-between pw-max-h-full pw-overflow-auto scrollbar-sm pw-h-full">
            <OrderItems />
            <OrderPaymentInfo />
          </div>
          <OrderPayment />
        </>
      ) : (
        <EmptyState />
      )}
    </>
  );
};

export default memo(SummaryFnb);
