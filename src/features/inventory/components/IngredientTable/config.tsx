import { formatCurrency } from '~app/utils/helpers';

type Params = {
  t: ExpectedAny;
  canViewPrice: boolean;
  isExport: boolean;
};

const renderUomName = (rowData: IngredientInventoryDetail) => {
  if (rowData.uom_id === rowData.uom.id) return rowData.uom.name;
  return rowData.uom?.sub_uom?.name || rowData.uom.name;
};

export function ingredientTableConfig({ t, canViewPrice, isExport }: Params) {
  let pricing = null;
  let totalPrice = null;
  if (canViewPrice) {
    pricing = {
      key: 'pricing',
      label: t('ingredient-table.historical_cost'),
      align: 'right',
      flexGrow: 0.7,
      cell: ({ rowData }: { rowData: IngredientInventoryDetail }) => (
        <div className="pw-w-full pw-text-right pw-text-sm pw-px-3">{formatCurrency(rowData.pricing)}</div>
      ),
    };
    totalPrice = {
      key: 'total_price',
      label: t('ingredient-table.total_price'),
      align: 'right',
      flexGrow: 0.8,
      cell: ({ rowData }: { rowData: IngredientInventoryDetail }) => {
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
      key: 'name',
      label: t('ingredient-table.ingredient'),
      align: 'left',
      flexGrow: 1,
      cell: ({ rowData }: { rowData: IngredientInventoryDetail }) => (
        <div className="pw-w-full pw-text-sm pw-px-3">{rowData.name}</div>
      ),
    },
    {
      key: 'uom',
      label: t('ingredient-table.uom'),
      align: 'left',
      flexGrow: 1,
      cell: ({ rowData }: { rowData: IngredientInventoryDetail }) => (
        <div className="pw-w-full pw-text-sm pw-px-3">{renderUomName(rowData)}</div>
      ),
    },
    pricing,
    {
      key: 'quantity',
      label: isExport ? t('ingredient-table.quantity-export') : t('ingredient-table.quantity'),
      align: 'right',
      flexGrow: 0.5,
      cell: ({ rowData }: { rowData: IngredientInventoryDetail }) => {
        return <div className="pw-w-full pw-text-right pw-text-sm pw-px-3">{formatCurrency(rowData.quantity)}</div>;
      },
    },
    totalPrice,
  ];
}
