import { useTranslation } from 'react-i18next';
import { Checkbox } from 'rsuite';
import { ImageTextCell } from '~app/components';
import { formatCurrency, getFinalPrice } from '~app/utils/helpers';

type Props = {
  product: Product;
  checked?: boolean;
  onChange(product: Product, checked: boolean): void;
};

const ProductSelectItem = ({ product, checked, onChange }: Props) => {
  const { t } = useTranslation('chat');
  return (
    <div
      className="pw-grid pw-grid-cols-12 pw-py-2.5 pw-pr-2 pw-cursor-pointer"
      onClick={() => {
        if (checked === undefined) return;
        onChange(product, !checked);
      }}
    >
      <div className="pw-col-span-7">
        <ImageTextCell
          image={product?.images?.[0]}
          text={product.name}
          secondText={
            product.product_type === 'variant'
              ? `${product.list_sku.length.toString()} ${t('variant')}`
              : product.list_sku[0]?.sku_code || product.product_code
          }
          className="!pw-pl-0"
          textClassName="pw-font-bold pw-text-sm line-clamp-1"
          secondTextClassName="pw-text-neutral-secondary pw-text-sm line-clamp-1"
        />
      </div>
      <div className="pw-col-span-4 pw-flex pw-items-center pw-justify-end pw-text-sm">
        {product.min_price && product.max_price ? (
          <span className="line-clamp-1">
            {`${formatCurrency(product.min_price)}₫ - ${formatCurrency(product.max_price)}₫`}
          </span>
        ) : (
          formatCurrency(
            getFinalPrice({
              normal_price: product.list_sku[0]?.normal_price || 0,
              selling_price: product.list_sku[0]?.selling_price || 0,
            }),
          )
        )}
      </div>
      <div className="pw-col-span-1 pw-flex pw-items-center pw-justify-center">
        <Checkbox
          checked={checked}
          onChange={(_, newChecked: boolean) => {
            onChange(product, newChecked);
          }}
        />
      </div>
    </div>
  );
};

export default ProductSelectItem;
