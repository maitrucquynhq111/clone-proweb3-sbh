import { memo } from 'react';
import { SelectPicker } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { OrderPayment, ButtonActionBottom, SearchLocationInput, ContactListInput } from '~app/features/pos/components';
import OrderPaymentInfo from '~app/features/pos/components/OrderPayment/OrderPaymentInfo';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { DeliveryMethodType, getWholesalePrice } from '~app/features/pos/utils';
import { PriceType } from '~app/features/pos/constants';
import { getFinalPrice } from '~app/utils/helpers';

type Props = {
  removeContact?(): void;
};

const SummaryRetailer = ({ removeContact }: Props) => {
  const { t } = useTranslation('pos');
  const [buyerInfo] = useSelectedOrderStore((store) => store.buyer_info);
  const [deliveryMethod] = useSelectedOrderStore((store) => store.delivery_method);
  const [isWholesalePrice, setStore] = useSelectedOrderStore((store) => store.is_wholesale_price);

  const {
    setting: { pos },
  } = useOfflineContext();

  const dataPrice = [PriceType.NORMAL, PriceType.WHOLESALE].map((item) => ({
    label: t(item),
    value: item,
  }));

  const handleChangePriceType = (value: PriceType | null) => {
    if (value === PriceType.NORMAL) {
      setStore((store) => {
        const newListOrderItem = store.list_order_item.map((item) => {
          const price = getFinalPrice({
            normal_price: item.product_normal_price,
            selling_price: item.product_selling_price,
          });
          return { ...item, price };
        });
        return { ...store, list_order_item: newListOrderItem, is_wholesale_price: false };
      });
    } else {
      setStore((store) => {
        const newListOrderItem = store.list_order_item.map((item) => {
          const price = getWholesalePrice(item);
          return { ...item, price };
        });
        return { ...store, list_order_item: newListOrderItem, is_wholesale_price: true };
      });
    }
  };
  return (
    <>
      <div className="pw-flex pw-flex-col">
        <div className="pw-flex pw-my-3 pw-mx-6 pw-gap-x-2">
          <ContactListInput removeContact={removeContact} className="pw-flex-2" />
          <SelectPicker
            searchable={false}
            cleanable={false}
            data={dataPrice}
            className="pw-flex-1"
            defaultValue={isWholesalePrice ? PriceType.WHOLESALE : PriceType.NORMAL}
            onChange={(value: PriceType | null) => handleChangePriceType(value)}
          />
        </div>
        {buyerInfo.name && (!pos?.fnb_active || deliveryMethod === DeliveryMethodType.SELLER_DELIVERY) && (
          <div className="pw-flex pw-flex-col pw-px-6">
            <SearchLocationInput />
          </div>
        )}
        <ButtonActionBottom
          canChooseContact={false}
          className="!pw-px-6 !pw-pt-4"
          classNameBtn="!pw-text-xs !pw-px-2 !pw-py-3 !pw-shadow-productItem"
        />
      </div>
      <div className="pw-flex pw-flex-col pw-justify-between pw-max-h-full pw-overflow-auto scrollbar-sm pw-h-full">
        <OrderPaymentInfo
          className="!pw-border-none !pw-px-6 !pw-pt-0 pw-max-h-full pw-overflow-auto scrollbar-sm pw-h-full"
          canCompletePayment={true}
        />
        <OrderPayment canCompletePayment={true} />
      </div>
    </>
  );
};

export default memo(SummaryRetailer);
