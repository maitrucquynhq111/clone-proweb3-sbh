import cx from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Drawer } from 'rsuite';
import { FaBoxes } from 'react-icons/fa';
import { DrawerBody, DrawerFooter, DrawerHeader, PlaceholderImage } from '~app/components';
import { ProductDrawerType } from '~app/features/pos/constants';
import {
  skuHasAttribute,
  usePosStore,
  useProductVariant,
  useSelectedAddons,
  useSelectedOrderStore,
} from '~app/features/pos/hooks';
import {
  addToListOrderItem,
  canPickSkus,
  getOrderItemCanPickQuantity,
  getSkusQuantity,
  removeOrderItem,
  toInitialOrderItem,
  updateListOrderItem,
} from '~app/features/pos/utils';
import { ModalPlacement, ModalSize } from '~app/modals';
import { formatCurrency, getCanPickQuantityProduct, getFinalPrice, getRangePrice } from '~app/utils/helpers';
import { sortArrayByKey } from '~app/utils/helpers/arrayHelpers';
import { ProductAddonGroup } from '~app/features/pos/components';
import QuantityControl from '~app/components/QuantityControl';
import { QuantityControlSize } from '~app/utils/constants';

type Props = {
  product: Product;
  orderItemId?: string;
  isEditedAddon?: boolean;
};

const ProductVariantAddonDrawer = ({ product, orderItemId = '', isEditedAddon = false }: Props) => {
  const { t } = useTranslation('pos');
  const [drawer, setPosStore] = usePosStore((store) => store.selected_drawer);
  const [orderItems, setSelectedOrderStore] = useSelectedOrderStore((store) => store.list_order_item);
  const [selectedAddons, setSelectedAddons] = useSelectedAddons((store) => store.selected_list);
  const {
    selectedSku,
    selectedAttributes,
    inititalInvalidAttributes,
    setSelectedAttributes,
    addOrRemoveAttribute,
    filteredSkusExcludeVariant,
  } = useProductVariant(product.list_variant || [], product, orderItems, orderItemId);
  const [quantity, setQuantity] = useState(product?.list_product_add_on_group.length > 0 ? '' : '1');
  const [requiredVariants, setRequiredVariants] = useState<string[]>([]);
  const [isInput, setIsInput] = useState<boolean | undefined>(false);

  const existedOrderItem = orderItems.find((orderItem) => orderItem.id === orderItemId);
  const variants = product.list_variant || [];
  const isStockProduct = product.list_sku.some((sku) => sku.sku_type === 'stock');
  const isStockSku = selectedSku ? selectedSku.sku_type === 'stock' : false;
  const canPickQuantitySku =
    selectedSku && isStockSku
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
        selected_order_item: '',
        is_edited_addon: false,
      }));
    }
  };

  const handleChange = (value: string, isInput?: boolean) => {
    if ((!value || value === '0') && !isInput)
      setSelectedAddons((store) => ({ ...store, required_groups: [], selected_list: [] }));
    setIsInput(isInput);
    setQuantity(value);
  };

  const handleBlur = (value: string) => {
    if (!value || value === '0') setSelectedAddons((store) => ({ ...store, required_groups: [], selected_list: [] }));
    setIsInput(false);
  };

  const handleRemoveOrderItem = () => {
    if (!existedOrderItem) return;
    setSelectedOrderStore((store) => {
      return { ...store, list_order_item: removeOrderItem(existedOrderItem, store.list_order_item) };
    });
  };

  const handleSubmit = () => {
    // Check select all variants
    const newRequiredVarianst = product.list_variant
      ? product.list_variant
          ?.filter((variant) => !variant.list_attribute.some((attr) => selectedAttributes.includes(attr.id)))
          .map((variant) => variant.id)
      : [];
    if (newRequiredVarianst.length > 0) {
      return setRequiredVariants(newRequiredVarianst);
    }
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
    const sku = product.list_sku.find((sku) => sku.id === existedOrderItem.sku_id);
    if (!sku) return;
    const selectedAttribute = sku.list_attribute.map((attr) => attr.attribute_id);
    setSelectedAttributes(selectedAttribute);
    setQuantity(existedOrderItem.quantity.toString());
    setSelectedAddons((store) => ({ ...store, selected_list: existedOrderItem.order_item_add_on }));
  }, [existedOrderItem, product.list_sku]);

  useEffect(() => {
    if (!isInput && (!quantity || quantity === '0') && selectedAddons.length > 0) setQuantity('1');
  }, [selectedAddons, quantity, isInput]);

  return (
    <Drawer
      backdrop="static"
      keyboard={false}
      placement={ModalPlacement.Right}
      size={ModalSize.Small}
      open={drawer === ProductDrawerType.VARIANT_ADDON_DRAWER}
      className="pw-h-screen"
    >
      <div className="pw-flex pw-flex-col !pw-h-screen pw-bg-neutral-background">
        <DrawerHeader title={t('action.add_to_cart')} onClose={handleClose} />
        <DrawerBody className="pw-flex-1 pw-flex pw-flex-col pw-overflow-auto !pw-p-0 scrollbar-sm">
          <div className="pw-flex pw-py-4 pw-px-6 pw-bg-white pw-gap-x-3 pw-items-center pw-mb-1">
            {selectedSku ? (
              <PlaceholderImage
                src={selectedSku.media?.[0]}
                className="!pw-w-18 !pw-h-18 pw-border pw-border-solid pw-border-neutral-divider pw-rounded-md pw-object-cover"
              />
            ) : (
              <PlaceholderImage
                src={product?.images?.[0]}
                className="!pw-w-18 !pw-h-18 pw-border pw-border-solid pw-border-neutral-divider pw-rounded-md pw-object-cover"
              />
            )}
            <div className="pw-flex-1">
              <h3 className="pw-text-lg pw-text-neutral-primary pw-font-bold line-clamp-1">{product.name}</h3>
              <div className="pw-w-full pw-flex pw-justify-between pw-items-end pw-gap-y-2">
                <span className="pw-text-red-600 pw-text-base pw-font-semibold">
                  {selectedSku ? formatCurrency(getFinalPrice(selectedSku)) : getRangePrice(product)}
                </span>
                {selectedSku && isStockSku && (
                  <div className="pw-flex pw-items-center pw-text-xs pw-font-semibold pw-text-neutral-primary pw-gap-x-1">
                    <FaBoxes className="pw-fill-neutral-placeholder" size={12} />
                    <span>
                      {t('stock')}: {canPickQuantitySku}
                    </span>
                  </div>
                )}
                {!selectedSku && isStockProduct && (
                  <div className="pw-flex pw-items-center pw-text-xs pw-font-semibold pw-text-neutral-primary pw-gap-x-1">
                    <FaBoxes className="pw-fill-neutral-placeholder" size={12} />
                    <span>
                      {t('stock')}: {getCanPickQuantityProduct(product)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {sortArrayByKey(variants, 'priority').map((variant) => {
            const filteredSkus = filteredSkusExcludeVariant(variant);
            const isRequired = requiredVariants.includes(variant.id);
            return (
              <div className="pw-py-4 pw-px-6 pw-mb-1 pw-bg-white" key={variant.id}>
                <h4
                  className={cx('pw-text-lg pw-font-bold', {
                    'pw-text-red-600': isRequired,
                    'pw-text-neutral-title': !isRequired,
                  })}
                >
                  {variant.name === 'default_attribute' ? t('select_variant') : variant.name}
                  <span className="pw-text-red-600 pw-inline-block pw-ml-1">*</span>
                </h4>
                {isRequired ? (
                  <p className="pw-text-red-600 pw-inline-block pw-mt-2 pw-text-xs pw-font-semibold">
                    {t('error.not_select_variant_yet')}
                  </p>
                ) : null}
                <div className="pw-flex pw-gap-2 pw-flex-wrap pw-mt-4">
                  {variant.list_attribute.map((attribute) => {
                    const isActive = selectedAttributes.includes(attribute.id);
                    const quantity = getSkusQuantity(
                      filteredSkus.filter((sku) => skuHasAttribute(sku.list_attribute, attribute.id)),
                    );
                    const canPickSku = canPickSkus(
                      filteredSkus.filter((sku) => skuHasAttribute(sku.list_attribute, attribute.id)),
                    );
                    let allowSelect = (quantity > 0 || canPickSku) && !inititalInvalidAttributes.includes(attribute.id);
                    // If is in list order item
                    if (existedOrderItem && selectedSku) {
                      allowSelect =
                        allowSelect && selectedSku.list_attribute.some((item) => item.attribute_id === attribute.id);
                    }
                    return (
                      <Button
                        key={attribute.id}
                        disabled={!allowSelect}
                        type="button"
                        onClick={() => {
                          if (existedOrderItem) return;
                          setRequiredVariants((prevState) => prevState.filter((item) => item !== variant.id));
                          addOrRemoveAttribute(attribute.id);
                        }}
                        className={cx(' !pw-rounded !pw-border !pw-border-solid', {
                          '!pw-bg-blue-50 !pw-border-blue-700': isActive,
                          '!pw-bg-neutral-100 !pw-border-transparent': !isActive,
                          '!pw-bg-transparent-4 !pw-text-neutral-disable !pw-opacity-50': !allowSelect,
                        })}
                      >
                        <span
                          className={cx('pw-text-sm ', {
                            'pw-text-blue-700 ': isActive,
                            'pw-text-gray-600': !isActive,
                          })}
                        >
                          {attribute.name}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
              onBlur={handleBlur}
              disabled={selectedSku ? false : true}
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

export default ProductVariantAddonDrawer;
