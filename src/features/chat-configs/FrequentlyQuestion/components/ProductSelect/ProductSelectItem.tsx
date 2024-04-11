import { useTranslation } from 'react-i18next';
import { BsXCircle } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { Checkbox } from 'rsuite';
import { ImageTextCell } from '~app/components';
import { getProductImage } from '~app/utils/helpers';

type Props = {
  product: Product;
  checked?: boolean;
  disabled?: boolean;
  onChange(product: Product, checked: boolean, isDelete?: boolean): void;
};

const ProductSelectItem = ({ product, checked, disabled, onChange }: Props) => {
  const { t } = useTranslation('chat');
  return (
    <div
      className="pw-grid pw-grid-cols-12 pw-py-2.5 pw-pr-2 pw-cursor-pointer"
      onClick={() => {
        if (checked === undefined) return;
        if (disabled) return toast.error(t('error.max_product_length_question'));
        onChange(product, !checked);
      }}
    >
      <div className="pw-col-span-11">
        <ImageTextCell
          image={getProductImage(product)}
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
      <div className="pw-col-span-1 pw-flex pw-items-center pw-justify-center">
        {checked === undefined ? (
          <div className="pw-bg-white pw-cursor-pointer" onClick={() => onChange(product, false, true)}>
            <BsXCircle size={24} />
          </div>
        ) : (
          <Checkbox
            checked={checked}
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              if (disabled) return toast.error(t('error.max_product_length_question'));
              onChange(product, !checked);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductSelectItem;
