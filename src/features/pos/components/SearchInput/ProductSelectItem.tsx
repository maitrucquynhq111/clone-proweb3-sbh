import cx from 'classnames';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageTextCell } from '~app/components';
import { getCanPickQuantityProduct, getRangePrice } from '~app/utils/helpers';

type Props = {
  product: Product;
  handleClickProduct(productItem: Product): void;
  className?: string;
};

const ProductSelectItem = ({ product, className = '', handleClickProduct }: Props) => {
  const { t } = useTranslation('pos');

  const can_pick_quantity = getCanPickQuantityProduct(product);
  const canPick =
    typeof can_pick_quantity === 'boolean'
      ? can_pick_quantity
      : typeof can_pick_quantity === 'string' || can_pick_quantity > 0;

  const getCanPickQuantity = () => {
    if (!canPick) return t('common:out-of-stock');

    if ((typeof can_pick_quantity === 'boolean' && can_pick_quantity === true) || typeof can_pick_quantity === 'string')
      return t('common:in-stock');

    return `${t('common:can_pick')}: ${can_pick_quantity}`;
  };

  return (
    <div
      className={cx('pw-flex pw-mb-4 pw-cursor-pointer pw-items-center pw-gap-2', className, {
        'pw-opacity-50': !canPick,
      })}
      onClick={() => {
        if (!canPick) return;
        handleClickProduct(product);
      }}
    >
      <ImageTextCell
        image={product.images?.[0] || ''}
        text={product.name}
        secondText={
          product.list_sku.length > 1 ? `${product.list_sku.length} ${t('variant')}` : product.list_sku?.[0]?.sku_code
        }
        className="!pw-px-0"
        textClassName="pw-font-semibold pw-mb-1 pw-text-sm"
        secondTextClassName="pw-text-xs pw-text-neutral-secondary"
      />
      <div className="pw-flex pw-flex-col pw-items-end pw-flex-none">
        <span className="pw-font-semibold pw-text-sm">{getRangePrice(product)}</span>
        <span
          className={cx('pw-text-neutral-secondary pw-text-xs', {
            '!pw-text-warning-active': !canPick,
          })}
        >
          {getCanPickQuantity()}
        </span>
      </div>
    </div>
  );
};

export default memo(ProductSelectItem);
