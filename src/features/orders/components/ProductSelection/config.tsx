import ProductQuantityCell from './ProductQuantityCell';
import { ImageTextCell } from '~app/components';
import { getCanPickQuantitySku } from '~app/utils/helpers';

type Params = {
  t: ExpectedAny;
};

export function productTableConfig({ t }: Params) {
  return [
    {
      key: 'product_name',
      label: t('orders-form:product'),
      align: 'left',
      flexGrow: 1,
      cell: ({ rowData }: { rowData: Sku }) => {
        return (
          <ImageTextCell
            image={rowData?.media?.[0] || ''}
            text={rowData?.product?.name || ''}
            textClassName="pw-font-bold pw-text-base pw-text-neutral-primary line-clamp-2"
            secondText={rowData.name}
          />
        );
      },
    },
    {
      key: 'is_active',
      label: t('orders-form:can_pick'),
      align: 'center',
      width: 109,
      cell: ({ rowData }: { rowData: Sku }) => {
        const can_pick_quantity = getCanPickQuantitySku(rowData);
        if (typeof can_pick_quantity === 'boolean') {
          return (
            <span className="pw-text-base pw-font-semibold pw-text-neutral-primary">
              {can_pick_quantity ? t('products-form:stocking') : t('products-form:out_of_stock')}
            </span>
          );
        }
        return <span className="pw-text-base pw-font-semibold pw-text-neutral-primary">{can_pick_quantity}</span>;
      },
    },
    {
      key: 'quantity',
      label: t('orders-form:quantity'),
      align: 'right',
      width: 137,
      cell: ({ rowData: sku }: { rowData: Sku }) => <ProductQuantityCell sku={sku} />,
    },
  ];
}
