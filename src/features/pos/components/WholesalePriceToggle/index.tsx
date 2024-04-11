import { useTranslation } from 'react-i18next';
import { SquareToggle } from '~app/components';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { getWholesalePrice } from '~app/features/pos/utils';
import { getFinalPrice } from '~app/utils/helpers';

const WholesalePriceToggle = () => {
  const { t } = useTranslation('pos');
  const [isWholesalePrice, setStore] = useSelectedOrderStore((store) => store.is_wholesale_price);

  const handleClick = (value: boolean) => {
    if (value) {
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
    <SquareToggle
      value={!isWholesalePrice ? true : false}
      leftText={t('normal_price')}
      rightText={t('wholesale_price')}
      onClick={handleClick}
    />
  );
};

export default WholesalePriceToggle;
