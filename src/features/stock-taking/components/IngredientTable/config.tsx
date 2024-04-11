import { IconButton } from 'rsuite';
import { BsTrash } from 'react-icons/bs';
import QuantityCell from '../QuantityCell';
import { StockTakingAnalyticStatus } from '~app/utils/constants';

type ConfigParams = {
  t: ExpectedAny;
  status: string;
  onRemove(sku: PendingStockTakingPoDetailIngredient): void;
};

export function skuColumnsConfig({ t, status, onRemove }: ConfigParams) {
  const columns = [
    {
      key: 'name',
      label: t('ingredient'),
      flexGrow: 1,
      cell: ({ rowData }: { rowData: PendingStockTakingPoDetailIngredient }) => {
        return <div className="pw-w-full pw-px-2.5 pw-text-base pw-text-neutral-primary">{rowData.name}</div>;
      },
    },
    {
      key: 'sku_code',
      label: t('ingredients-table:uom'),
      cell: ({ rowData }: { rowData: PendingStockTakingPoDetailIngredient }) => {
        return <div className="pw-w-full pw-px-2.5">{rowData.uom.name}</div>;
      },
    },
    {
      key: 'before_change_quantity',
      label: t('system_stock'),
      align: 'right',
      width: 143,
      cell: ({ rowData }: { rowData: PendingStockTakingPoDetailIngredient }) => {
        return (
          <div className="pw-w-full pw-text-right pw-px-2.5 pw-font-semibold pw-text-base pw-text-neutral-primary">
            {Number(rowData.before_change_quantity.toFixed(4))}
          </div>
        );
      },
    },
    {
      key: 'after_change_quantity',
      width: 140,
      label: t('real_stock'),
      align: 'right',
      cell: ({ rowData, rowIndex }: { rowData: PendingStockTakingPoDetailIngredient; rowIndex: number }) => {
        return (
          <div className="pw-w-full pw-text-right pw-font-semibold pw-text-base pw-text-neutral-primary">
            {status === StockTakingAnalyticStatus.PROCESSING ? (
              <QuantityCell name={`po_detail_ingredient.${rowIndex}.after_change_quantity`} />
            ) : (
              <div className="pw-px-2.5">{rowData.after_change_quantity}</div>
            )}
          </div>
        );
      },
    },
    {
      key: 'diff',
      label: t('total_quantity_short'),
      align: 'right',
      cell: ({ rowData }: { rowData: PendingStockTakingPoDetailIngredient }) => {
        const { before_change_quantity, after_change_quantity } = rowData;
        const diff = +after_change_quantity - before_change_quantity;
        return (
          <div className="pw-w-full pw-text-right pw-px-2.5 pw-font-semibold pw-text-base pw-text-neutral-primary">
            {diff > 0 ? `+${Number(diff.toFixed(4))}` : Number(diff.toFixed(4))}
          </div>
        );
      },
    },
  ];
  if (status === StockTakingAnalyticStatus.PROCESSING) {
    columns.push({
      key: 'action',
      cell: ({ rowData }: { rowData: PendingStockTakingPoDetailIngredient }) => {
        return (
          <div className="pw-w-full pw-text-left pw-px-2.5">
            <IconButton appearance="subtle" icon={<BsTrash size={24} />} onClick={() => onRemove(rowData)} />
          </div>
        );
      },
    } as ExpectedAny);
  }
  return columns;
}
