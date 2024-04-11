import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAdd } from 'react-icons/md';
import QuantityControl from '~app/components/QuantityControl';
import { ProductDrawerType } from '~app/features/pos/constants';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import { addToListOrderItem, removeOrderItem, toInitialOrderItem, updateListOrderItem } from '~app/features/pos/utils';
import { QuantityControlSize } from '~app/utils/constants';
import { getCanPickQuantitySku, isProductAddon, isProductVariant } from '~app/utils/helpers';

type Props = {
  sku: Sku;
};

const ProductQuantityCell = ({ sku }: Props) => {
  const { t } = useTranslation(['common', 'orders-form']);
  const [, setPosStore] = usePosStore((store) => store.selected_product_id);
  const [orderItem, setSelectedOrderStore] = useSelectedOrderStore((store) => {
    return store.list_order_item.find((item) => item.sku_id === sku.id);
  });
  const can_pick_quantity = getCanPickQuantitySku(sku);
  const canPick = typeof can_pick_quantity === 'boolean' ? can_pick_quantity : can_pick_quantity > 0;
  const maxQuantity = typeof can_pick_quantity === 'number' ? can_pick_quantity : canPick ? Infinity : 0;
  const isVariant = sku?.product ? isProductVariant(sku.product) : false;
  const isAddon = sku?.product ? isProductAddon(sku?.product) : false;

  const handleClick = () => {
    if (!sku || !sku?.product) return;
    if (orderItem && isAddon) {
      return setPosStore((store) => ({
        ...store,
        selected_product: sku.product as Product,
        selected_drawer: ProductDrawerType.CART_DRAWER,
      }));
    }
    if (isVariant && isAddon) {
      return setPosStore((store) => ({
        ...store,
        selected_product: sku.product as Product,
        selected_drawer: ProductDrawerType.VARIANT_ADDON_DRAWER,
      }));
    }
    if (isAddon) {
      return setPosStore((store) => ({
        ...store,
        selected_product: sku.product as Product,
        selected_drawer: ProductDrawerType.SINGLE_ADDON,
      }));
    }
    // Add single product to list order item
    const newOrderItem = toInitialOrderItem(sku.product, sku);
    setSelectedOrderStore((store) => {
      const listOrderItem = addToListOrderItem(newOrderItem, store.list_order_item, 1, store.is_wholesale_price);
      return { ...store, list_order_item: listOrderItem };
    });
  };

  const handleRemoveOrderItem = () => {
    setSelectedOrderStore((store) => {
      if (!orderItem) return store;
      return { ...store, list_order_item: removeOrderItem(orderItem, store.list_order_item) };
    });
  };

  const handleChange = (value: string, isInput?: boolean) => {
    if (!isInput && (!value || value === '0')) return handleRemoveOrderItem();
    setSelectedOrderStore((store) => {
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

  const handleBlur = (value: string) => {
    if (!value || value === '0') {
      return handleRemoveOrderItem();
    }
  };

  if (!canPick) {
    return (
      <div className="pw-px-2.5 pw-flex pw-justify-end">
        <button className="pw-w-8 pw-h-8 pw-rounded pw-flex pw-justify-center pw-items-center pw-bg-transparent-4 pw-cursor-not-allowed">
          <MdAdd className="pw-text-neutral-white" size={20} />
        </button>
      </div>
    );
  }

  if (isAddon || !orderItem) {
    return (
      <div className="pw-px-2.5 pw-flex pw-justify-end">
        <button
          className="pw-w-8 pw-h-8 pw-rounded pw-flex pw-justify-center pw-items-center pw-bg-primary-main"
          onClick={handleClick}
        >
          <MdAdd className="pw-text-neutral-white" size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="pw-px-2.5 pw-flex pw-flex-col pw-justify-end">
      <QuantityControl
        size={QuantityControlSize.Small}
        onChange={handleChange}
        onBlur={handleBlur}
        defaultValue={orderItem?.quantity.toString()}
        disabled={!canPick}
        maxQuantity={maxQuantity}
        errorMessage={t('orders-form:error.max_quantity') || ''}
      />
    </div>
  );
};

export default memo(ProductQuantityCell);
