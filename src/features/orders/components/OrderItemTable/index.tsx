import { toast } from 'react-toastify';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { columnsConfig } from './config';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import { removeOrderItem, updateListOrderItem } from '~app/features/pos/utils';
import { StaticTable } from '~app/components';
import { useProductsByIds } from '~app/services/queries';
import { ProductDrawerType } from '~app/features/pos/constants';
import { OrderPermission, useHasPermissions } from '~app/utils/shield';

const OrderItemTable = () => {
  const { t } = useTranslation('orders-form');
  const [isEdit, setPosStore] = usePosStore((store) => store.is_edit_order);
  const [orderItems, setSelectedOrderStore] = useSelectedOrderStore((store) => store.list_order_item);
  const canUpdatePrice = useHasPermissions([OrderPermission.ORDER_ORDERDETAIL_PRICE_UPDATE]);

  const { data: productResponse, isFetching } = useProductsByIds({
    page: 1,
    pageSize: 75,
    ids: orderItems
      .filter((orderItem) => orderItem.order_item_add_on.length > 0)
      .map((orderItem) => orderItem.product_id),
  });

  const handleInputChange = useCallback(
    (orderItem: PendingOrderItem, key: keyof PendingOrderItem, value: string) => {
      setSelectedOrderStore((store) => {
        if (!orderItem) return store;
        let newRemoteQuantity = orderItem.remote_quantity;
        if (key === 'quantity' && +value) {
          newRemoteQuantity = +value;
        }
        const newOrderItem: PendingOrderItem = { ...orderItem, [key]: +value, remote_quantity: newRemoteQuantity };
        const listOrderItem = updateListOrderItem(newOrderItem, store.list_order_item);
        return { ...store, list_order_item: listOrderItem };
      });
    },
    [setSelectedOrderStore],
  );

  const handleRemove = useCallback(
    (orderItem: PendingOrderItem, value: string) => {
      if (!+value || value === '0') {
        setSelectedOrderStore((store) => {
          if (!orderItem) return store;
          if (store.list_order_item.length === 1) {
            toast.error(t('error.at_least_one_item'));
            const listOrderItem = updateListOrderItem(
              { ...orderItem, quantity: orderItem?.remote_quantity || 0 },
              store.list_order_item,
            );
            return { ...store, list_order_item: listOrderItem };
          } else {
            const listOrderItem = removeOrderItem(orderItem, store.list_order_item);
            return { ...store, list_order_item: listOrderItem };
          }
        });
      }
    },
    [setSelectedOrderStore],
  );

  const handleOpenDrawer = useCallback(
    (orderItem: PendingOrderItem) => {
      const products = productResponse?.data || [];
      const product = products.find((item) => item.id === orderItem.product_id);
      if (!product) return;
      setPosStore((store) => ({
        ...store,
        selected_product: product,
        selected_order_item: orderItem.id || '',
        selected_drawer: ProductDrawerType.CART_DRAWER,
      }));
    },
    [setPosStore, productResponse],
  );

  const configs = useMemo(() => {
    return columnsConfig({
      t,
      canUpdatePrice,
      isEdit,
      isFetching,
      onInputChange: handleInputChange,
      onRemove: handleRemove,
      onOpenDrawer: handleOpenDrawer,
    });
  }, [isEdit, isFetching, columnsConfig, handleInputChange, handleRemove, handleOpenDrawer]);

  return (
    <>
      {configs ? (
        <div className="pw-max-h-96 pw-overflow-auto scrollbar-sm">
          <StaticTable columnConfig={configs} data={orderItems} rowKey="id" />
        </div>
      ) : null}
    </>
  );
};

export default memo(OrderItemTable);
