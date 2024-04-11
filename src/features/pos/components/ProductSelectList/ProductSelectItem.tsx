import cx from 'classnames';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
// import { FaBoxes } from 'react-icons/fa';
import { Avatar } from 'rsuite';
import ButtonTransparent from '~app/components/ButtonTransparent';
import PlaceholderImage from '~app/components/PlaceholderImage';
import { ProductDrawerType } from '~app/features/pos/constants';
import { usePosStore } from '~app/features/pos/hooks';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';
import { addToListOrderItem, toInitialOrderItem, updateListOrderItem } from '~app/features/pos/utils';
import {
  getCanPickQuantityProduct,
  getRangePrice,
  isProductAddon,
  isProductVariant,
  acronymName,
} from '~app/utils/helpers';

type Props = {
  product: Product;
  className?: string;
};

const ProductSelectItem = ({ product, className = '' }: Props) => {
  const { t } = useTranslation('pos');
  const [selectedOrderItem, setStore] = useSelectedOrderStore((store) => {
    return store.list_order_item.find((item) => item.product_id === product.id);
  });
  const [, setPosStore] = usePosStore((store) => store.selected_product);

  const can_pick_quantity = getCanPickQuantityProduct(product);
  const canPick =
    typeof can_pick_quantity === 'boolean'
      ? can_pick_quantity
      : typeof can_pick_quantity === 'string' || can_pick_quantity > 0;
  // const isStock = product.list_sku.some((sku) => sku.sku_type === 'stock');

  const handleClick = () => {
    if (selectedOrderItem && isProductAddon(product)) {
      return setPosStore((store) => ({
        ...store,
        selected_product: product,
        selected_drawer: ProductDrawerType.CART_DRAWER,
      }));
    }
    if (isProductVariant(product) && isProductAddon(product)) {
      return setPosStore((store) => ({
        ...store,
        selected_product: product,
        selected_drawer: ProductDrawerType.VARIANT_ADDON_DRAWER,
      }));
    }
    if (isProductAddon(product)) {
      return setPosStore((store) => ({
        ...store,
        selected_product: product,
        selected_drawer: ProductDrawerType.SINGLE_ADDON,
      }));
    }
    if (isProductVariant(product)) {
      return setPosStore((store) => ({
        ...store,
        selected_product: product,
        selected_drawer: ProductDrawerType.VARIANT_DRAWER,
      }));
    }
    // Already in order list item
    if (selectedOrderItem) {
      // Check max quantity
      if (
        selectedOrderItem.quantity <
        (typeof selectedOrderItem?.can_pick_quantity === 'number' ? selectedOrderItem.can_pick_quantity : Infinity)
      ) {
        setStore((store) => {
          const listOrderItem = updateListOrderItem(
            { ...selectedOrderItem, quantity: selectedOrderItem.quantity + 1 },
            store.list_order_item,
            store.is_wholesale_price,
          );
          return { ...store, list_order_item: listOrderItem };
        });
      } else {
        toast.error('common:error.max_quantity');
      }
    } else {
      const sku = product.list_sku[0];
      if (sku) {
        const orderItem = toInitialOrderItem(product, sku, undefined, undefined, product.uom || sku.uom);
        setStore((store) => {
          const listOrderItem = addToListOrderItem(orderItem, store.list_order_item, 1, store.is_wholesale_price);
          return { ...store, list_order_item: listOrderItem };
        });
      }
    }
  };

  return (
    <ButtonTransparent
      className={cx(
        '!pw-relative !pw-rounded !pw-whitespace-normal !pw-border-2 !pw-border-solid pw-shadow-productItem',
        {
          '!pw-border-primary-main': !!selectedOrderItem,
          '!pw-border-none': !selectedOrderItem,
        },
        className,
      )}
      disabled={!canPick}
      onClick={handleClick}
    >
      <div className="pw-flex pw-flex-col pw-h-full">
        <div className="pw-relative pw-pb-22">
          <PlaceholderImage
            src={product?.images?.[0] || ''}
            alt={product.name}
            defaultElement={
              <Avatar
                style={{ background: '#E6EAED', color: '#0E873F', fontWeight: 'bold' }}
                className={cx('pw-object-cover !pw-w-full !pw-h-full pw-absolute pw-text-primary-main', {
                  'pw-opacity-50': !canPick,
                })}
              >
                {acronymName(product.name)}
              </Avatar>
            }
            className={cx('pw-object-cover pw-w-full pw-h-full pw-absolute', {
              'pw-opacity-50': !canPick,
            })}
          />
          <div
            className="pw-h-1/2 pw-w-full pw-absolute pw-z-10 pw-bottom-0
          pw-flex pw-items-end pw-pb-2  pw-justify-center"
          >
            {/* {isStock && canPick ? (
              <div className="pw-flex pw-items-center pw-justify-center pw-gap-x-1">
                <FaBoxes className="pw-fill-white" size={12} />
                <span className="pw-text-xs pw-font-semibold pw-text-gray-50">
                  {t('stock')}: {can_pick_quantity}
                </span>
              </div>
            ) : null} */}
            {!canPick ? (
              <div className="pw-bg-black pw-bg-opacity-80 pw-w-16 pw-h-16 pw-rounded-full pw-flex pw-items-center pw-justify-center">
                <span className="pw-text-white pw-text-xs">{t('common:out-of-stock')}</span>
              </div>
            ) : null}
          </div>
          <span
            className={cx(
              'pw-absolute pw-shadow-revert pw-right-0 pw-top-0 pw-text-xs pw-font-semibold pw-text-neutral-white pw-bg-neutral-secondary pw-p-1 pw-rounded-bl',
              {
                'pw-opacity-50': !canPick,
              },
            )}
          >
            {getRangePrice(product)}
          </span>
        </div>
        <div className="pw-pt-1 pw-pb-2 pw-bg-neutral-white pw-h-full pw-px-1 pw-flex pw-flex-col pw-items-center pw-justify-center ">
          <div className="pw-h-full">
            <h4
              className={cx('pw-text-sm pw-font-normal pw-text-black pw-max-w-full line-clamp-2', {
                'pw-opacity-50': !canPick,
              })}
            >
              {product.name}
            </h4>
          </div>
        </div>
      </div>
    </ButtonTransparent>
  );
};

export default memo(ProductSelectItem);
