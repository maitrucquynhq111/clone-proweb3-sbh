import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { FaBoxes } from 'react-icons/fa';
import { Tag } from 'rsuite';
import QuantityControl from '~app/components/QuantityControl';
import { QuantityControlSize } from '~app/utils/constants';
import { formatCurrency } from '~app/utils/helpers';

type Props = {
  className?: string;
  orderItem?: PendingOrderItem;
  sku: Sku;
  canPickQuanity: number;
  onChange(sku: Sku, quantity: number, isInput?: boolean): void;
  onBlur(sku: Sku, quantity: number): void;
};

const ProductSkuItem = ({ sku, orderItem, canPickQuanity, onChange, onBlur, className = '' }: Props) => {
  const { t } = useTranslation('pos');
  const isStock = sku.sku_type === 'stock' ? true : false;
  const isOutOfStock = isStock ? canPickQuanity <= 0 : !sku.is_active;

  const handleChange = (value: string, isInput?: boolean) => {
    onChange(sku, +value, isInput);
  };

  const handleBlur = (value: string) => {
    onBlur(sku, +value);
  };
  return (
    <div className={cx(className)}>
      <div className="pw-flex pw-flex-col pw-gap-y-1.5">
        <span
          className={cx('y pw-text-base', {
            'pw-text-neutral-primary': !isOutOfStock,
            'pw-text-neutral-placeholder': isOutOfStock,
          })}
        >
          {sku.name}
        </span>
        {isStock ? (
          <div className="pw-flex pw-items-center pw-gap-x-1">
            <FaBoxes className="pw-fill-neutral-placeholder" size={12} />
            <span className="pw-text-xs pw-font-semibold pw-text-neutral-placeholder">
              {t('stock')}: {canPickQuanity}
            </span>
          </div>
        ) : null}
        {sku.selling_price && sku.selling_price < sku.normal_price ? (
          <div className="pw-flex pw-items-center pw-gap-x-2">
            <span
              className={cx('pw-font-semibold pw-text-base', {
                'pw-text-neutral-placeholder': isOutOfStock,
                'pw-text-secondary-main': !isOutOfStock,
              })}
            >
              {formatCurrency(sku.selling_price)}đ
            </span>
            <span className="pw-line-through pw-text-neutral-placeholder pw-text-sm">
              {formatCurrency(sku.normal_price)}đ
            </span>
          </div>
        ) : (
          <span
            className={cx('pw-font-semibold pw-text-base', {
              'pw-text-neutral-placeholder': isOutOfStock,
              'pw-text-secondary-main': !isOutOfStock,
            })}
          >
            {formatCurrency(sku.normal_price)}đ
          </span>
        )}
      </div>
      {isOutOfStock ? (
        <Tag size="sm">{t('out_of_stock')}</Tag>
      ) : (
        <div className="pw-w-36">
          <QuantityControl
            size={QuantityControlSize.Small}
            onChange={handleChange}
            onBlur={handleBlur}
            maxQuantity={canPickQuanity}
            defaultValue={orderItem?.quantity.toString()}
            placeholder="0"
          />
        </div>
      )}
    </div>
  );
};

export default ProductSkuItem;
