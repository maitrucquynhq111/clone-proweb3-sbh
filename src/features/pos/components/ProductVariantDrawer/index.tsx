import cx from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsHandbagFill } from 'react-icons/bs';
import { Button, Drawer } from 'rsuite';
import ProductSkuItem from './ProductSkuItem';
import { DrawerBody, DrawerFooter, DrawerHeader, PlaceholderImage } from '~app/components';
import { ProductDrawerType } from '~app/features/pos/constants';
import { skuHasAttribute, usePosStore, useProductVariant, useSelectedOrderStore } from '~app/features/pos/hooks';
import {
  getOrderItemCanPickQuantity,
  addToListOrderItem,
  updateListOrderItem,
  removeOrderItem,
  toInitialOrderItem,
} from '~app/features/pos/utils';
import { ModalPlacement, ModalSize } from '~app/modals';
import { formatCurrency, getRangePrice } from '~app/utils/helpers';

type Props = {
  product: Product;
};

const ProductVariantDrawer = ({ product }: Props) => {
  const { t } = useTranslation('pos');
  const [drawer, setPosStore] = usePosStore((store) => store.selected_drawer);
  const [orderItems, setSelectedOrderStore] = useSelectedOrderStore((store) => store.list_order_item);
  const { selectedAttributes, addOrRemoveAttribute, filteredSkusExcludeVariant } = useProductVariant(
    product.list_variant || [],
    product,
    orderItems,
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [requiredVariants, setRequiredVariants] = useState<string[]>([]);
  const [selectedOrderItems, setSelectedOrderItems] = useState<PendingOrderItem[]>([]);

  const variants = useMemo(() => {
    return product?.list_variant ? product.list_variant : [];
  }, [product]);

  const filteredSkus = useMemo(() => {
    if (!selectedVariant) return [] as Sku[];
    return filteredSkusExcludeVariant(selectedVariant);
  }, [filteredSkusExcludeVariant, selectedVariant]);

  const handleChange = useCallback(
    (sku: Sku, quantity: number, isInput?: boolean) => {
      const existedOrderItem = selectedOrderItems.find((item) => item.sku_id === sku.id);
      if (existedOrderItem) {
        // If quantity = 0 and not is input
        if (!isInput && !quantity)
          return setSelectedOrderItems((prevState) =>
            updateListOrderItem({ ...existedOrderItem, quantity: 0 }, prevState),
          );
        return setSelectedOrderItems((prevState) => updateListOrderItem({ ...existedOrderItem, quantity }, prevState));
      } else {
        if (!quantity) return;
        const orderItem = toInitialOrderItem(product, sku, undefined, undefined, product.uom || sku.uom);
        setRequiredVariants([]);
        return setSelectedOrderItems((prevState) => addToListOrderItem(orderItem, prevState, 1));
      }
    },
    [selectedOrderItems],
  );

  const handleBlur = useCallback(
    (sku: Sku, quantity: number) => {
      const existedOrderItem = selectedOrderItems.find((item) => item.sku_id === sku.id);
      if (!quantity && existedOrderItem) {
        return setSelectedOrderItems((prevState) =>
          updateListOrderItem({ ...existedOrderItem, quantity: 0 }, prevState),
        );
      }
    },
    [selectedOrderItems],
  );

  const handleClose = () => {
    setPosStore((store) => ({ ...store, selected_drawer: null, selected_product: null }));
  };

  const handleSubmit = () => {
    if (orderItems.filter((item) => item.product_id === product.id).length === 0) {
      const filteredSelectedOrderItems = selectedOrderItems.filter((item) => item.quantity > 0);
      if (selectedAttributes.length === 0 && filteredSelectedOrderItems.length === 0) {
        return setRequiredVariants(variants.map((variant) => variant.id));
      }
      if (filteredSelectedOrderItems.length === 0) {
        return setRequiredVariants([selectedVariant?.id || '']);
      }
    }
    selectedOrderItems.forEach((selectedOrderItem) => {
      const existedOrderItem = orderItems.find((item) => item.sku_id === selectedOrderItem.sku_id);
      // Check selected sku is in order list
      if (existedOrderItem) {
        // if sku quantity = 0 remove from order list
        if (selectedOrderItem.quantity === 0) {
          setSelectedOrderStore((store) => ({
            ...store,
            list_order_item: removeOrderItem(existedOrderItem, store.list_order_item),
          }));
        }
        // Update quantity
        else {
          setSelectedOrderStore((store) => ({
            ...store,
            list_order_item: updateListOrderItem(
              { ...existedOrderItem, quantity: selectedOrderItem.quantity },
              store.list_order_item,
            ),
          }));
        }
      } else {
        if (!selectedOrderItem.quantity) return;
        setSelectedOrderStore((store) => ({
          ...store,
          list_order_item: addToListOrderItem(selectedOrderItem, store.list_order_item, selectedOrderItem.quantity),
        }));
      }
    });
    handleClose();
  };

  useEffect(() => {
    if (!product.list_variant) return;
    if (product.list_variant.length === 1) {
      setSelectedVariant(product?.list_variant[0] || null);
    }
  }, [product.list_variant]);

  // Init selected order item
  useEffect(() => {
    setSelectedOrderItems(() => orderItems.filter((item) => item.product_id === product.id));
  }, [orderItems, product]);

  const totalQuantity = useMemo(() => {
    return selectedOrderItems.reduce((acc, cur) => {
      return acc + cur.quantity;
    }, 0);
  }, [selectedOrderItems]);

  const totalPrice = useMemo(() => {
    return selectedOrderItems.reduce((acc, cur) => {
      return acc + cur.quantity * cur.price;
    }, 0);
  }, [selectedOrderItems]);

  return (
    <Drawer
      backdrop="static"
      keyboard={false}
      placement={ModalPlacement.Right}
      size={ModalSize.Medium}
      open={drawer === ProductDrawerType.VARIANT_DRAWER}
      className="pw-h-screen"
    >
      <div className="pw-flex pw-flex-col !pw-h-screen pw-bg-neutral-background">
        <DrawerHeader title={t('action.add_to_cart')} onClose={handleClose} />
        <DrawerBody className="pw-flex-1 pw-flex pw-flex-col pw-overflow-auto !pw-p-0 scrollbar-sm">
          <div className="pw-flex pw-py-4 pw-px-6 pw-bg-neutral-white pw-gap-x-3 pw-items-center pw-mb-1">
            <PlaceholderImage
              src={product?.images?.[0]}
              className="!pw-w-18 !pw-h-18 pw-border pw-border-solid pw-border-neutral-divider pw-rounded-md pw-object-cover"
            />
            <div className="pw-flex-1">
              <h3 className="pw-text-lg pw-text-neutral-primary pw-font-bold line-clamp-1">{product.name}</h3>
              <h4 className="mt-2 pw-text-error-active pw-text-base pw-font-semibold">{getRangePrice(product)}</h4>
            </div>
          </div>
          {variants.length === 2
            ? variants.slice(0, 1).map((variant) => {
                const isRequired = requiredVariants.includes(variant.id);
                return (
                  <div className="pw-py-4 pw-px-6 pw-mb-1 pw-bg-neutral-white" key={variant.id}>
                    <h4
                      className={cx('pw-text-lg pw-font-bold', {
                        'pw-text-error-active': isRequired,
                        'pw-text-neutral-title': !isRequired,
                      })}
                    >
                      {variant.name === 'default_attribute' ? t('select_variant') : variant.name}
                      <span className="pw-text-error-active pw-inline-block pw-ml-1">*</span>
                    </h4>
                    {isRequired ? (
                      <p className="pw-text-error-active pw-inline-block pw-mt-2 pw-text-xs pw-font-semibold">
                        {t('error.not_select_variant_yet')}
                      </p>
                    ) : null}
                    <div className="pw-flex pw-gap-2 pw-flex-wrap pw-mt-4">
                      {variant.list_attribute.map((attribute) => {
                        const isActive = selectedAttributes.includes(attribute.id);
                        const totalAttributeQuantity = selectedOrderItems.reduce((acc, cur) => {
                          const isAttributeInSelectedOrderItems = product.list_sku.some(
                            (sku) => sku.id === cur.sku_id && skuHasAttribute(sku.list_attribute, attribute.id),
                          );
                          if (!isAttributeInSelectedOrderItems) return acc;
                          return acc + cur.quantity;
                        }, 0);
                        return (
                          <Button
                            key={attribute.id}
                            type="button"
                            onClick={() => {
                              setRequiredVariants((prevState) => prevState.filter((item) => item !== variant.id));
                              addOrRemoveAttribute(attribute.id);
                              if (isActive) {
                                setSelectedVariant(null);
                              } else {
                                setSelectedVariant(variants[1] || null);
                              }
                            }}
                            className={cx('!pw-relative !pw-rounded !pw-border !pw-border-solid !pw-overflow-visible', {
                              '!pw-bg-blue-50 !pw-border-blue-700': isActive,
                              '!pw-bg-neutral-100 !pw-border-transparent': !isActive,
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
                            {totalAttributeQuantity ? (
                              <div
                                className="pw-px-1.5 pw-bg-error-active pw-text-neutral-white -pw-right-1.5 -pw-top-1.5
                                pw-absolute pw-text-xs pw-font-bold pw-z-10 pw-rounded-full"
                              >
                                {totalAttributeQuantity > 99 ? '99+' : totalAttributeQuantity}
                              </div>
                            ) : null}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            : null}
          {selectedVariant ? (
            <div className="pw-h-full pw-bg-neutral-white">
              <div className="pw-py-4 pw-px-6 ">
                <h4
                  className={cx('pw-text-lg pw-font-bold', {
                    'pw-text-error-active': requiredVariants.includes(selectedVariant.id),
                    'pw-text-neutral-title': !requiredVariants.includes(selectedVariant.id),
                  })}
                >
                  {selectedVariant.name === 'default_attribute' ? t('select_variant') : selectedVariant.name}
                  <span className="pw-text-error-active pw-inline-block pw-ml-1">*</span>
                </h4>
                {requiredVariants.includes(selectedVariant.id) ? (
                  <p className="pw-text-error-active pw-inline-block pw-mt-2 pw-text-xs pw-font-semibold">
                    {t('error.not_select_variant_yet')}
                  </p>
                ) : null}
              </div>
              {filteredSkus.map((sku, index) => {
                const orderItem = selectedOrderItems.find((item) => item.sku_id === sku.id);
                const canPickQuanity = getOrderItemCanPickQuantity(
                  sku.id,
                  sku.can_pick_quantity,
                  selectedOrderItems,
                  orderItem?.id,
                );
                return (
                  <ProductSkuItem
                    key={sku.id}
                    className={cx(
                      `pw-py-3 pw-px-6 pw-bg-neutral-white pw-border-b pw-border-solid pw-border-b-neutral-divider
                      pw-flex pw-items-center pw-justify-between`,
                      {
                        'pw-pt-0': index === 0,
                      },
                    )}
                    sku={sku}
                    orderItem={orderItem}
                    canPickQuanity={canPickQuanity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                );
              })}
            </div>
          ) : null}
        </DrawerBody>
        <DrawerFooter className="pw-bg-neutral-white !pw-shadow-revert !pw-border-none">
          <Button
            appearance="primary"
            block
            className="!pw-gap-x-2 !pw-justify-center !pw-flex !pw-text-base !pw-font-bold !pw-text-neutral-white"
            onClick={handleSubmit}
          >
            <div className="pw-p-3 pw-relative">
              <BsHandbagFill size={24} />
              {totalQuantity ? (
                <div
                  className="pw-px-1.5 pw-bg-error-active pw-text-neutral-white pw-right-1.5 pw-top-1.5
                    pw-absolute pw-text-xs pw-font-bold pw-z-10 pw-rounded-full"
                >
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </div>
              ) : null}
            </div>
            <span className="">{t('action.update_cart')}</span>
            {totalPrice > 0 ? (
              <>
                <span>-</span> <span>{formatCurrency(totalPrice)}</span>
              </>
            ) : null}
          </Button>
        </DrawerFooter>
      </div>
    </Drawer>
  );
};

export default ProductVariantDrawer;
