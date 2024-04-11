import cx from 'classnames';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { columnOptions } from './config';
import EmptyState from './EmptyState';
import { StaticTable } from '~app/components';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';
import { removeOrderItem, updateListOrderItem } from '~app/features/pos/utils';

type Props = {
  className?: string;
};

const OrderItemsTable = ({ className }: Props) => {
  const { t } = useTranslation(['common, pos']);
  const [listOrderItem, setStore] = useSelectedOrderStore((store) => store.list_order_item);

  const handleRemoveOrderItem = (orderItem: PendingOrderItem) => {
    setStore((store) => {
      if (!orderItem) return store;
      return { ...store, list_order_item: removeOrderItem(orderItem, store.list_order_item) };
    });
  };

  const handleChangeQuantity = (value: string, orderItem: PendingOrderItem) => {
    if (!value || value === '0') return handleRemoveOrderItem(orderItem);
    if (+value === orderItem.can_pick_quantity) toast.error(t('common:error.max_quantity'));
    setStore((store) => {
      if (!orderItem) return store;
      if (!value) return store;
      // Get wholesale price
      const listOrderItem = updateListOrderItem(
        { ...orderItem, quantity: +value },
        store.list_order_item,
        store.is_wholesale_price,
      );
      return { ...store, list_order_item: listOrderItem };
    });
  };

  const handleChangePrice = (value: string, orderItem: PendingOrderItem) => {
    setStore((store) => {
      if (!orderItem) return store;
      const newOrderItem: PendingOrderItem = { ...orderItem, price: +value };
      const listOrderItem = updateListOrderItem(newOrderItem, store.list_order_item);
      return { ...store, list_order_item: listOrderItem };
    });
  };

  const setShowEditNote = (orderItem: PendingOrderItem) => {
    setStore((store) => {
      if (!orderItem) return store;
      const newOrderItem: PendingOrderItem = { ...orderItem, show_edit_note: !orderItem.show_edit_note };
      const listOrderItem = updateListOrderItem(newOrderItem, store.list_order_item);
      return { ...store, list_order_item: listOrderItem };
    });
  };

  const columnConfig = useMemo(() => {
    return columnOptions({
      t,
      handleRemoveSku: handleRemoveOrderItem,
      handleChangeQuantity: handleChangeQuantity,
      handleChangePrice: handleChangePrice,
      listOrderItems: listOrderItem,
      setShowEditNote: setShowEditNote,
    });
  }, [listOrderItem]);

  return (
    <div className={cx(className)}>
      {listOrderItem.length > 0 ? (
        <StaticTable columnConfig={columnConfig} data={listOrderItem} rowKey="id" className="pw-rounded" />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default OrderItemsTable;
