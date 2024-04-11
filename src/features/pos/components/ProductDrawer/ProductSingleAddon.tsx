import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBoxes } from 'react-icons/fa';
import { Button, Drawer } from 'rsuite';
import { DrawerBody, DrawerFooter, DrawerHeader, PlaceholderImage } from '~app/components';
import QuantityControl from '~app/components/QuantityControl';
import { ProductAddonGroup } from '~app/features/pos/components';
import { ProductDrawerType } from '~app/features/pos/constants';
import { usePosStore, useSelectedAddons, useSelectedOrderStore } from '~app/features/pos/hooks';
import {
  addToListOrderItem,
  getOrderItemCanPickQuantity,
  removeOrderItem,
  toInitialOrderItem,
  updateListOrderItem,
} from '~app/features/pos/utils';
import { ModalPlacement, ModalSize } from '~app/modals';
import { QuantityControlSize } from '~app/utils/constants';
import { formatCurrency, getFinalPrice, getRangePrice } from '~app/utils/helpers';

type Props = {
  product: Product;
  orderItemId?: string;
  isEditedAddon?: boolean;
};

const ProductSingleAddon = ({ product, orderItemId, isEditedAddon = false }: Props) => {
  const { t } = useTranslation('pos');
  const [drawer, setPosStore] = usePosStore((store) => store.selected_drawer);
  const [orderItems, setSelectedOrderStore] = useSelectedOrderStore((store) => store.list_order_item);
  const [selectedAddons, setSelectedAddons] = useSelectedAddons((store) => store.selected_list);
  const [quantity, setQuantity] = useState('1');

  const selectedSku = useMemo(() => product.list_sku[0], []);
  const existedOrderItem = orderItems.find((orderItem) => orderItem.id === orderItemId);
  const isStock = product.list_sku.some((sku) => sku.sku_type === 'stock');
  const canPickQuantitySku =
    selectedSku && isStock
      ? getOrderItemCanPickQuantity(selectedSku.id, selectedSku.can_pick_quantity, orderItems, orderItemId)
      : Infinity;

  const handleClose = () => {
    const selectedOrderItems = orderItems.find((item) => item.product_id === product.id);
    if (selectedOrderItems && !isEditedAddon) {
      setPosStore((store) => ({ ...store, selected_drawer: ProductDrawerType.CART_DRAWER, selected_order_item: '' }));
    } else {
      setPosStore((store) => ({
        ...store,
        selected_drawer: null,
        selected_product: null,
        is_edited_addon: false,
        selected_order_item: '',
      }));
    }
  };

  const handleChange = (value: string) => {
    if (canPickQuantitySku > 0) {
      setQuantity(value);
    }
  };

  const handleRemoveOrderItem = () => {
    if (!existedOrderItem) return;
    setSelectedOrderStore((store) => {
      return { ...store, list_order_item: removeOrderItem(existedOrderItem, store.list_order_item) };
    });
  };

  const handleSubmit = () => {
    // Check select required addon group
    const newRequiredAddonGroups = product?.list_product_add_on_group
      ? product.list_product_add_on_group
          .filter((addonGroup) => {
            if (!addonGroup.is_required) return false;
            if (addonGroup.list_product_add_on.every((item) => item.is_active === false)) return false;
            return !selectedAddons.some((addon) =>
              addonGroup.list_product_add_on.some((item) => item.id === addon.product_add_on_id),
            );
          })
          .map((addonGroup) => addonGroup.id)
      : [];
    if (newRequiredAddonGroups.length > 0) {
      return setSelectedAddons((store) => ({ ...store, required_groups: newRequiredAddonGroups }));
    }
    if (!quantity || quantity === '0') {
      handleRemoveOrderItem();
      return handleClose();
    }
    // Add to cart
    if (existedOrderItem) {
      if (!selectedSku) return;
      setSelectedOrderStore((store) => {
        const listOrderItem = updateListOrderItem(
          { ...existedOrderItem, quantity: +quantity, order_item_add_on: selectedAddons },
          store.list_order_item,
          store.is_wholesale_price,
        );
        return { ...store, list_order_item: listOrderItem };
      });
    } else {
      if (!selectedSku) return;
      const newOrderItem = {
        ...toInitialOrderItem(product, selectedSku, undefined, undefined, product.uom || selectedSku.uom),
        order_item_add_on: selectedAddons,
      };
      setSelectedOrderStore((store) => {
        const listOrderItem = addToListOrderItem(
          newOrderItem,
          store.list_order_item,
          +quantity,
          store.is_wholesale_price,
        );
        return { ...store, list_order_item: listOrderItem };
      });
    }
    handleClose();
  };

  useEffect(() => {
    if (selectedSku) {
      setSelectedAddons((store) => ({ ...store, can_select: true }));
    } else {
      setSelectedAddons((store) => ({ ...store, can_select: false }));
    }
  }, [setSelectedAddons, selectedSku]);

  useEffect(() => {
    if (!existedOrderItem) return;
    setQuantity(existedOrderItem.quantity.toString());
    setSelectedAddons((store) => ({ ...store, selected_list: existedOrderItem.order_item_add_on }));
  }, [existedOrderItem]);

  return (
    <Drawer
      backdrop="static"
      keyboard={false}
      placement={ModalPlacement.Right}
      size={ModalSize.Small}
      open={drawer === ProductDrawerType.SINGLE_ADDON}
      className="pw-h-screen"
    >
      <div className="pw-flex pw-flex-col !pw-h-screen pw-bg-neutral-background">
        <DrawerHeader title={t('action.add_to_cart')} onClose={handleClose} />
        <DrawerBody className="pw-flex-1 pw-flex pw-flex-col pw-overflow-auto !pw-p-0 scrollbar-sm">
          <div className="pw-flex pw-py-4 pw-px-6 pw-bg-white pw-gap-x-3 pw-items-center pw-mb-1">
            <PlaceholderImage
              src={product?.images?.[0]}
              className="!pw-w-18 !pw-h-18 pw-border pw-border-solid pw-border-neutral-divider pw-rounded-md pw-object-cover"
            />
            <div className="pw-flex-1">
              <h3 className="pw-text-lg pw-text-neutral-primary pw-font-bold">{selectedSku?.name || product.name}</h3>
              <div className="pw-w-full pw-flex pw-justify-between pw-items-end pw-gap-y-2">
                <span className="pw-text-red-600 pw-text-base pw-font-semibold">
                  {selectedSku ? formatCurrency(getFinalPrice(selectedSku)) : getRangePrice(product)}
                </span>
                {selectedSku && isStock && (
                  <div className="pw-flex pw-items-center pw-text-xs pw-font-semibold pw-text-neutral-primary pw-gap-x-1">
                    <FaBoxes className="pw-fill-neutral-placeholder" size={12} />
                    <span>
                      {t('stock')}: {canPickQuantitySku}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {product?.list_product_add_on_group.map((productAddOnGroup) => {
            return <ProductAddonGroup key={productAddOnGroup.id} addonGroup={productAddOnGroup} />;
          })}
        </DrawerBody>
        <DrawerFooter className="pw-bg-neutral-white !pw-shadow-revert !pw-border-none">
          <div className="!pw-w-4/12 pw-flex pw-flex-col pw-items-center">
            <QuantityControl
              size={QuantityControlSize.Medium}
              defaultValue={quantity}
              maxQuantity={canPickQuantitySku}
              onChange={handleChange}
              disabled={selectedSku && canPickQuantitySku > 0 ? false : true}
              placeholder="0"
            />
          </div>
          <Button appearance="primary" className="!pw-w-8/12" onClick={() => handleSubmit()}>
            {t('action.update_cart')}
          </Button>
        </DrawerFooter>
      </div>
    </Drawer>
  );
};

export default ProductSingleAddon;
