import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { memo, useMemo, useRef } from 'react';
import { BsPencilFill } from 'react-icons/bs';
import OrderItemPriceExtend from './OrderItemPriceExtend';
import QuantityControl from '~app/components/QuantityControl';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';
import {
  generateOrderItemAddonName,
  getTotalAddonPrice,
  removeOrderItem,
  updateListOrderItem,
} from '~app/features/pos/utils';
import { QuantityControlSize } from '~app/utils/constants';
import { AutoResizeInput } from '~app/components';

type Props = {
  id: string;
  canPickQuantity: number;
  className?: string;
  visible: boolean;
  setVisible(value: string): void;
  onOpen(value: string): void;
};

const OrderCartItem = ({ id, canPickQuantity, visible, className = '', setVisible, onOpen }: Props) => {
  const { t } = useTranslation('pos');
  const ref = useRef<HTMLDivElement | null>(null);
  const priceExtendRef = useRef<HTMLDivElement | null>(null);
  const [orderItem, setStore] = useSelectedOrderStore((store) => store.list_order_item.find((item) => item.id === id));

  const handleChange = (value: string, isInput?: boolean) => {
    if (!isInput && (!value || value === '0')) return handleRemoveOrderItem();
    setStore((store) => {
      if (!orderItem) return store;
      if (!value) return store;
      const listOrderItem = updateListOrderItem(
        { ...orderItem, quantity: +value },
        store.list_order_item,
        store.is_wholesale_price,
      );
      return { ...store, list_order_item: listOrderItem };
    });
  };

  const handlePriceChange = (value: string) => {
    setStore((store) => {
      if (!orderItem) return store;
      const newOrderItem: PendingOrderItem = { ...orderItem, price: +value };
      const listOrderItem = updateListOrderItem(newOrderItem, store.list_order_item);
      return { ...store, list_order_item: listOrderItem };
    });
  };

  const handleNoteChange = (value: string) => {
    setStore((store) => {
      if (!orderItem) return store;
      const newOrderItem: PendingOrderItem = { ...orderItem, note: value };
      const listOrderItem = updateListOrderItem(newOrderItem, store.list_order_item);
      return { ...store, list_order_item: listOrderItem };
    });
  };

  const handleRemoveOrderItem = () => {
    setStore((store) => {
      if (!orderItem) return store;
      return { ...store, list_order_item: removeOrderItem(orderItem, store.list_order_item) };
    });
  };

  const handleBlur = (value: string) => {
    if (!value || value === '0') {
      handleRemoveOrderItem();
    }
  };

  const handleShowPriceExtend = () => {
    if (!orderItem) return;
    setVisible(orderItem?.id || '');
  };

  const totalPrice = useMemo(() => {
    if (!orderItem) return '0';
    return ((orderItem.price + getTotalAddonPrice(orderItem.order_item_add_on)) * orderItem.quantity).toString();
  }, [orderItem]);

  return (
    <div className={cx('pw-flex pw-items-center pw-w-full', className)} ref={ref}>
      <div
        className="pw-flex-1"
        onClick={() => {
          if (visible) return;
          setVisible('');
        }}
      >
        <div className="pw-flex pw-justify-between pw-items-center">
          <h3 className="pw-font-normal pw-text-sm pw-mb-0.5 pw-overflow-hidden pw-text-litght-primary line-clamp-1">
            {orderItem?.sku_name}
          </h3>
          <button className="pw-flex pw-gap-x-2 pw-items-center" onClick={() => onOpen(id)}>
            <BsPencilFill className="pw-text-blue-700" />
            <span className="pw-text-sm pw-text-blue-700 pw-font-bold">{t('action.edit')}</span>
          </button>
        </div>
        {orderItem && orderItem.order_item_add_on.length > 0 ? (
          <div className="pw-mt-0.5 pw-text-sm pw-text-neutral-secondary">
            {generateOrderItemAddonName(orderItem.order_item_add_on)}
          </div>
        ) : null}
        <div className="pw-flex pw-justify-between pw-items-center pw-mt-2">
          <div className="pw-w-25">
            <QuantityControl
              size={QuantityControlSize.Small}
              defaultValue={orderItem?.quantity.toString()}
              maxQuantity={canPickQuantity}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShowPriceExtend();
            }}
          >
            <AutoResizeInput
              name=""
              className="!pw-bg-transparent hover:pw-cursor-pointer"
              isForm={false}
              isNumber={true}
              defaultValue={totalPrice}
              readOnly={true}
              disabled={visible}
              placeholder="0"
            />
          </button>
        </div>
        {orderItem && visible ? (
          <div
            ref={priceExtendRef}
            className={cx('pw-mt-2 pw-overflow-hidden', {
              'pw-w-0 pw-h-0': !visible,
              'pw-w-full pw-h-full': visible,
            })}
          >
            <OrderItemPriceExtend
              orderItem={orderItem}
              onPriceChange={handlePriceChange}
              onNoteChange={handleNoteChange}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default memo(OrderCartItem);
