import cx from 'classnames';
import { useRef } from 'react';
import OrderItem from './OrderItem';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';
import { getOrderItemCanPickQuantity } from '~app/features/pos/utils';

type Props = {
  className?: string;
};

const OrderItems = ({ className }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [listOrderItem] = useSelectedOrderStore((store) => store.list_order_item);

  return (
    <div className={cx(className)} ref={ref}>
      {listOrderItem.map((item) => {
        const canPickQuanity = getOrderItemCanPickQuantity(
          item.sku_id,
          item?.can_pick_quantity || Infinity,
          listOrderItem,
          item.id,
        );
        return <OrderItem key={item.id} id={item?.id || ''} canPickQuantity={canPickQuanity} />;
      })}
    </div>
  );
};

export default OrderItems;
