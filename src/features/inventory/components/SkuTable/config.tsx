import { formatCurrency } from '~app/utils/helpers';

type Params = {
  t: ExpectedAny;
  canViewPrice: boolean;
  isExport: boolean;
};

export function skuTableConfig({ t, canViewPrice, isExport }: Params) {
  let historicalCost = null;
  let totalPrice = null;
  if (canViewPrice) {
    historicalCost = {
      key: 'pricing',
      label: t('sku-table.historical_cost'),
      align: 'right',
      flexGrow: 0.7,
      cell: ({ rowData }: { rowData: ItemInventoryDetail }) => (
        <div className="pw-w-full pw-text-right pw-text-sm pw-px-3">{formatCurrency(rowData.pricing)}</div>
      ),
    };
    totalPrice = {
      key: 'total_price',
      label: t('sku-table.total_price'),
      align: 'right',
      flexGrow: 0.8,
      cell: ({ rowData }: { rowData: ItemInventoryDetail }) => {
        return (
          <div className="pw-w-full pw-text-right pw-text-sm pw-px-3">
            {formatCurrency(rowData.pricing * rowData.quantity)}
          </div>
        );
      },
    };
  }
  return [
    {
      key: 'sku_code',
      label: t('sku-table.sku'),
      align: 'left',
      flexGrow: 0.4,
      cell: ({ rowData }: { rowData: ItemInventoryDetail }) => (
        <div className="pw-w-full pw-px-3 pw-text-sm">{rowData.sku_code}</div>
      ),
    },
    {
      key: 'sku_name',
      label: t('sku-table.product'),
      align: 'left',
      flexGrow: 1,
      cell: ({ rowData }: { rowData: ItemInventoryDetail }) => (
        <div className="pw-w-full pw-px-3">
          <p className="pw-text-sm">{rowData.product_name}</p>
          <p className="pw-text-xs pw-text-neutral-secondary">{rowData.sku_name}</p>
        </div>
      ),
    },
    historicalCost,
    {
      key: 'quantity',
      label: isExport ? t('sku-table.quantity-export') : t('sku-table.quantity'),
      align: 'right',
      flexGrow: 0.5,
      cell: ({ rowData }: { rowData: ItemInventoryDetail }) => {
        return <div className="pw-w-full pw-text-right pw-text-sm pw-px-3">{formatCurrency(rowData.quantity)}</div>;
      },
    },
    totalPrice,
  ];
}
