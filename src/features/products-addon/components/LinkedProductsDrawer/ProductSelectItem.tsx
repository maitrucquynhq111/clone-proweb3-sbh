import cx from 'classnames';
import { Checkbox } from 'rsuite';
import { ImageTextCell } from '~app/components';

type Props = {
  index: number;
  product: Product;
  linked_products: PendingLinkedProductsAddOn[];
  onChange(index: number, product: Product, checked: boolean): void;
};

const ProductSelectItem = ({ index, product, linked_products, onChange }: Props) => {
  const checked = linked_products.find((item) => item.product_id === product.id);
  return (
    <div
      className={cx('pw-grid pw-grid-cols-12', {
        'pw-border-t pw-border-solid pw-border-neutral-300': index > 0,
      })}
    >
      <div className="pw-px-4 pw-py-2 pw-col-span-11 pw-border-r pw-border-solid pw-border-neutral-300">
        <ImageTextCell image={product?.images?.[0]} text={product.name} textClassName="line-clamp-1" />
      </div>
      <div className="pw-flex pw-items-center pw-justify-center">
        <Checkbox
          checked={!!checked}
          onChange={(_, checked: boolean) => {
            onChange(index, product, checked);
          }}
        />
      </div>
    </div>
  );
};

export default ProductSelectItem;
